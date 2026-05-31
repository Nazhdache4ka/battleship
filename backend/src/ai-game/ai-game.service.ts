import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_PROMPT } from './prompts/system-prompt';
import { AiMessage, AiTurnResponse, Board, BoardEnemy, Coordinates, IShip } from 'src/types/interfaces';
import { makeAiMoves } from './utils/make-ai-moves';
import { getWinner } from 'src/utils/game-logic/get-winner';
import { applyMove } from 'src/utils/game-logic/apply-move';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { createRandomFleetLayout } from 'src/utils/game-logic/create-random-fleet-layout';
import { getSunkShips } from 'src/utils/game-logic/get-sunk-ships';
import { convertAiBoardOnInitialization, convertAiBoardOnTurn } from './utils/convert-ai-board';

const AI_GAME_SESSION_EXPIRATION_TIME = 30 * 60 * 1000;

@Injectable()
export class AiGameService {
  private readonly openai: OpenAI;
  private readonly openaiModel: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });

    this.openaiModel = this.configService.getOrThrow<string>('OPENAI_MODEL');
  }

  async initializeAiGameSession(
    userId: number,
    playerBoard: []
  ): Promise<{ sessionId: number; aiBoardEnemy: BoardEnemy }> {
    const expiresAt = new Date(Date.now() + AI_GAME_SESSION_EXPIRATION_TIME);

    const messages: AiMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    const { board: aiBoard } = createRandomFleetLayout();

    const aiBoardEnemy = convertAiBoardOnInitialization(aiBoard);

    const session = await this.prisma.aiGameSession.create({
      data: {
        userId,
        playerBoard,
        aiBoard: aiBoard as unknown as [],
        messages,
        expiresAt,
      },
    });

    return { sessionId: session.id, aiBoardEnemy };
  }

  async triggerAiTurns(sessionId: number): Promise<{ aiTurnResponse: AiTurnResponse[]; winner: 'user' | 'ai' | null }> {
    const session = await this.prisma.aiGameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('AI game session not found');
    }

    const now = new Date();

    if (session.expiresAt <= now) {
      throw new BadRequestException('AI game session expired');
    }

    const aiTurnResponse = await makeAiMoves(sessionId, this.prisma, this.openai, this.openaiModel);

    const boards = await this.prisma.aiGameSession.findUnique({
      where: { id: sessionId },
      select: {
        playerBoard: true,
        aiBoard: true,
      },
    });

    const winner = getWinner(boards?.playerBoard as unknown as Board, boards?.aiBoard as unknown as Board);

    if (winner) {
      await this.prisma.aiGameSession.update({
        where: { id: sessionId },
        data: { status: 'FINISHED' },
      });
    }

    return {
      aiTurnResponse,
      winner,
    };
  }

  async applyUserTurn(
    sessionId: number,
    target: Coordinates
  ): Promise<{
    newBoard: BoardEnemy;
    newShips: IShip[];
    result: 'hit' | 'miss' | 'sunk';
    winner: 'user' | 'ai' | null;
  }> {
    const session = await this.prisma.aiGameSession.findUnique({
      where: { id: sessionId },
      select: {
        aiBoard: true,
        playerBoard: true,
      },
    });

    if (!session) {
      throw new NotFoundException('AI game session not found');
    }

    const { newBoard, newShips, result } = applyMove(
      session.aiBoard as unknown as Board,
      getShipsFromBoard(session.aiBoard as unknown as Board),
      target
    );

    const aiBoardEnemy = convertAiBoardOnTurn(newBoard);

    const aiShipsHidden = getSunkShips(newShips, newBoard);

    const winner = getWinner(session.playerBoard as unknown as Board, newBoard);

    if (winner) {
      await this.prisma.aiGameSession.update({
        where: { id: sessionId },
        data: { status: 'FINISHED' },
      });
    }

    await this.prisma.aiGameSession.update({
      where: { id: sessionId },
      data: {
        aiBoard: newBoard as [],
      },
    });

    return {
      newBoard: aiBoardEnemy,
      newShips: aiShipsHidden,
      result,
      winner,
    };
  }

  async deleteAiGameSession(sessionId: number) {
    await this.prisma.aiGameSession.delete({
      where: { id: sessionId },
    });
  }
}
