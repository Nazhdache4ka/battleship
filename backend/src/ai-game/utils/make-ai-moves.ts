import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma.service';
import { AiMessage, AiTurnResponse, Board, Coordinates } from 'src/types/interfaces';
import { getBoardForAiRequest } from './get-ai-board-request';
import { applyMove } from 'src/utils/game-logic/apply-move';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { validateAiTurn } from './validate-ai-turn';

const MAX_AI_CHAIN_MOVES = 100;
const MAX_RETRIES_PER_MOVE = 15;

type AiShotPick = Pick<AiTurnResponse, 'target' | 'message'>;

function parseAiShotResponse(content: string): AiShotPick | null {
  try {
    const parsed = JSON.parse(content) as AiShotPick;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.target?.x !== 'number' ||
      typeof parsed.target?.y !== 'number' ||
      typeof parsed.message !== 'string' ||
      !Number.isInteger(parsed.target.x) ||
      !Number.isInteger(parsed.target.y)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function createRetryHintMessage(reason: string, target?: Coordinates): AiMessage {
  return {
    role: 'user',
    content: JSON.stringify({
      type: 'invalid_target',
      ...(target ? { target } : {}),
      reason,
    }),
  };
}

async function requestValidAiShot(
  openai: OpenAI,
  openaiModel: string,
  board: Board,
  baseMessages: AiMessage[]
): Promise<{ shot: AiShotPick; assistantContent: string; userMessage: AiMessage }> {
  const aiTurnRequest = getBoardForAiRequest(board);
  const userMessage: AiMessage = {
    role: 'user',
    content: JSON.stringify(aiTurnRequest),
  };

  let messagesForAttempt: AiMessage[] = [...baseMessages, userMessage];

  for (let attempt = 0; attempt < MAX_RETRIES_PER_MOVE; attempt++) {
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      response_format: { type: 'json_object' },
      messages: messagesForAttempt,
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      messagesForAttempt = [...messagesForAttempt, createRetryHintMessage('empty_response')];
      continue;
    }

    const candidate = parseAiShotResponse(content);

    if (!candidate) {
      messagesForAttempt = [
        ...messagesForAttempt,
        { role: 'assistant', content },
        createRetryHintMessage('invalid_json_or_shape'),
      ];
      continue;
    }

    if (!validateAiTurn(board, candidate.target)) {
      messagesForAttempt = [
        ...messagesForAttempt,
        { role: 'assistant', content },
        createRetryHintMessage('already_targeted_or_out_of_bounds', candidate.target),
      ];
      continue;
    }

    return { shot: candidate, assistantContent: content, userMessage };
  }

  throw new BadRequestException('AI could not pick a valid target after retries');
}

export async function makeAiMoves(
  sessionId: number,
  prisma: PrismaService,
  openai: OpenAI,
  openaiModel: string
): Promise<AiTurnResponse[]> {
  const session = await prisma.aiGameSession.findUnique({
    where: { id: sessionId },
    select: {
      playerBoard: true,
      messages: true,
      updatedAt: true,
    },
  });

  if (!session) {
    throw new NotFoundException('AI game session not found');
  }

  try {
    let currentBoard = session.playerBoard as unknown as Board;
    let currentMessages = (session.messages as AiMessage[]) ?? [];
    const aiMoves: AiTurnResponse[] = [];

    for (let moveIndex = 0; moveIndex < MAX_AI_CHAIN_MOVES; moveIndex++) {
      const { shot, assistantContent, userMessage } = await requestValidAiShot(
        openai,
        openaiModel,
        currentBoard,
        currentMessages
      );

      const { newBoard, newShips, result } = applyMove(currentBoard, getShipsFromBoard(currentBoard), shot.target);

      aiMoves.push({
        board: newBoard,
        ships: newShips,
        result,
        target: shot.target,
        message: shot.message,
      });

      currentBoard = newBoard;
      currentMessages = [...currentMessages, userMessage, { role: 'assistant', content: assistantContent }];

      if (result === 'miss') {
        break;
      }
    }

    if (aiMoves.length === MAX_AI_CHAIN_MOVES) {
      throw new BadRequestException('AI move chain exceeded safe limit');
    }

    const updateResult = await prisma.aiGameSession.updateMany({
      where: {
        id: sessionId,
        updatedAt: session.updatedAt,
      },
      data: {
        messages: currentMessages,
        playerBoard: currentBoard as [],
      },
    });

    if (updateResult.count !== 1) {
      throw new ConflictException('AI game session was updated concurrently, please retry turn');
    }

    return aiMoves;
  } catch {
    throw new BadRequestException('Failed to make AI moves');
  }
}
