import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { AiTurnResponse, Board, BoardEnemy, Coordinates, IShip } from 'src/types/interfaces';
import { makeAiMoves } from './utils/make-ai-moves';
import { getWinner } from 'src/utils/game-logic/get-winner';
import { applyMove } from 'src/utils/game-logic/apply-move';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { createRandomFleetLayout } from 'src/utils/game-logic/create-random-fleet-layout';
import { getSunkShips } from 'src/utils/game-logic/get-sunk-ships';
import { convertAiBoardOnInitialization, convertAiBoardOnTurn } from './utils/convert-ai-board';
import { SessionService } from 'src/session/session.service';

const AI_GAME_SESSION_EXPIRATION_TIME = 30 * 60 * 1000;

@Injectable()
export class AiGameService {
  private readonly openai: OpenAI;
  private readonly openaiModel: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService
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

    const { board: aiBoard } = createRandomFleetLayout();

    const aiBoardEnemy = convertAiBoardOnInitialization(aiBoard);

    const session = await this.prisma.aiGameSession.create({
      data: {
        userId,
        playerBoard,
        aiBoard: aiBoard as unknown as [],
        expiresAt,
      },
    });

    return { sessionId: session.id, aiBoardEnemy };
  }

  async triggerAiTurns(
    sessionId: number,
    userId: number
  ): Promise<{ aiTurnResponse: AiTurnResponse[]; winner: 'user' | 'ai' | null }> {
    const aiTurnResponse = await makeAiMoves(sessionId, userId, this.sessionService, this.openai, this.openaiModel);

    const boards = await this.sessionService.getAiGameSession(sessionId, userId);

    const winner = getWinner(boards.playerBoard as unknown as Board, boards.aiBoard as unknown as Board);

    if (winner) {
      await this.sessionService.updateAiGameSession(sessionId, userId, { status: 'FINISHED' });
    }

    return {
      aiTurnResponse,
      winner,
    };
  }

  async applyUserTurn(
    sessionId: number,
    userId: number,
    target: Coordinates
  ): Promise<{
    newBoard: BoardEnemy;
    newShips: IShip[];
    result: 'hit' | 'miss' | 'sunk';
    winner: 'user' | 'ai' | null;
  }> {
    const session = await this.sessionService.getAiGameSession(sessionId, userId);

    const { newBoard, newShips, result } = applyMove(
      session.aiBoard as unknown as Board,
      getShipsFromBoard(session.aiBoard as unknown as Board),
      target
    );

    const aiBoardEnemy = convertAiBoardOnTurn(newBoard);

    const aiShipsHidden = getSunkShips(newShips, newBoard);

    const winner = getWinner(session.playerBoard as unknown as Board, newBoard);

    if (winner) {
      await this.sessionService.updateAiGameSession(sessionId, userId, { status: 'FINISHED' });
    }

    await this.sessionService.updateAiGameSession(sessionId, userId, { aiBoard: newBoard as [] });

    return {
      newBoard: aiBoardEnemy,
      newShips: aiShipsHidden,
      result,
      winner,
    };
  }

  async deleteAiGameSession(sessionId: number, userId: number) {
    await this.sessionService.deleteAiGameSession(sessionId, userId);
  }
}
