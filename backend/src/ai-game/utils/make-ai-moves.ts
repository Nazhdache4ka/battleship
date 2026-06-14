import { BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';
import { AiMessage, AiShotHistory, AiTurnResponse, Board, Coordinates } from 'src/types/interfaces';
import { createAiRequest } from './create-ai-request';
import { applyMove } from 'src/utils/game-logic/apply-move';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { validateAiTurn } from './validate-ai-turn';
import { SessionService } from 'src/session/session.service';
import { SYSTEM_PROMPT } from '../prompts/system-prompt';

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

function createRetryHintMessage(reason: string, target: Coordinates = { x: 0, y: 0 }): AiMessage {
  return {
    role: 'user',
    content: JSON.stringify({
      type: 'invalid_target',
      target,
      reason,
    }),
  };
}

async function requestValidAiShot(
  openai: OpenAI,
  openaiModel: string,
  board: Board,
  aiShotsHistory: AiShotHistory[]
): Promise<AiShotPick> {
  const aiTurnRequest = createAiRequest(board, aiShotsHistory);
  const userMessage: AiMessage = {
    role: 'user',
    content: JSON.stringify(aiTurnRequest),
  };

  const messagesForAttempt: AiMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, userMessage];

  for (let attempt = 0; attempt < MAX_RETRIES_PER_MOVE; attempt++) {
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      response_format: { type: 'json_object' },
      messages: messagesForAttempt,
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      messagesForAttempt.push(createRetryHintMessage('empty_response'));
      continue;
    }

    const candidate = parseAiShotResponse(content);

    if (!candidate) {
      messagesForAttempt.push({ role: 'assistant', content }, createRetryHintMessage('invalid_json_or_shape'));
      continue;
    }

    if (!validateAiTurn(board, candidate.target)) {
      messagesForAttempt.push(
        { role: 'assistant', content },
        createRetryHintMessage('already_targeted_or_out_of_bounds', candidate.target)
      );
      continue;
    }

    return candidate;
  }

  throw new BadRequestException('AI could not pick a valid target after retries');
}

export async function makeAiMoves(
  sessionId: number,
  userId: number,
  sessionService: SessionService,
  openai: OpenAI,
  openaiModel: string
): Promise<AiTurnResponse[]> {
  const session = await sessionService.getAiGameSession(sessionId, userId);

  try {
    let currentBoard = session.playerBoard as unknown as Board;
    const aiMoves: AiTurnResponse[] = [];
    const aiShotsHistory = session.aiShotsHistory as unknown as AiShotHistory[];

    for (let moveIndex = 0; moveIndex < MAX_AI_CHAIN_MOVES; moveIndex++) {
      const shot = await requestValidAiShot(
        openai,
        openaiModel,
        currentBoard,
        aiShotsHistory
      );

      const { newBoard, newShips, result } = applyMove(currentBoard, getShipsFromBoard(currentBoard), shot.target);

      aiShotsHistory.push({ x: shot.target.x, y: shot.target.y, result });

      aiMoves.push({
        board: newBoard,
        ships: newShips,
        result,
        target: shot.target,
        message: shot.message,
      });

      currentBoard = newBoard;

      if (result === 'miss') {
        break;
      }
    }

    if (aiMoves.length === MAX_AI_CHAIN_MOVES) {
      throw new BadRequestException('AI move chain exceeded safe limit');
    }

    await sessionService.updateAiGameSessionOptimistic(sessionId, userId, session.updatedAt, {
      playerBoard: currentBoard as [],
      aiShotsHistory: aiShotsHistory as [],
    });

    return aiMoves;
  } catch {
    throw new BadRequestException('Failed to make AI moves');
  }
}
