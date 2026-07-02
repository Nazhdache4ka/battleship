import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AppSocket } from 'src/types/app-socket';
import { Board, IQueuePlayer } from 'src/types/interfaces';
import { createMatchmakingSession } from './utils/create-matchmaking-session';
import { Server } from 'socket.io';
import { createMatchmakingRoom } from './utils/create-matchmaking-room';
import { getInitialPayloadForPlayer } from './utils/get-initial-payload-for-player';
import { getOpponentInfo } from './utils/get-opponent-info';
import { SessionService } from 'src/session/session.service';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { applyMove } from 'src/utils/game-logic/apply-move';
import { getMatchmakingWinner } from './utils/get-matchmaking-winner';
import { getMovePayload } from './utils/get-move-payload';
import { COLUMN_NUMBER, ROW_NUMBER } from 'src/models/basic-constants';

@Injectable()
export class MultiplayerService {
  private queuePlayers: IQueuePlayer[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService
  ) {}

  async joinQueue(client: AppSocket, payload: { board: Board }, server: Server) {
    const user = client.data.user;

    if (!user) {
      return;
    }

    if (this.queuePlayers.some(player => player.userId === user.id)) {
      return;
    }

    this.queuePlayers.push({
      userId: user.id,
      socketId: client.id,
      board: payload.board,
    });

    if (this.queuePlayers.length >= 2) {
      const [player1, player2] = this.queuePlayers.splice(0, 2);

      try {
        const session = await createMatchmakingSession(player1, player2, this.prisma);

        const { session: updatedSession } = await createMatchmakingRoom(player1, player2, server, this.prisma, session);

        const opponent1 = await getOpponentInfo(player2.userId, this.prisma);

        const opponent2 = await getOpponentInfo(player1.userId, this.prisma);

        server
          .to(player1.socketId)
          .emit('game:start', getInitialPayloadForPlayer(player1, player2, updatedSession, opponent1));

        server
          .to(player2.socketId)
          .emit('game:start', getInitialPayloadForPlayer(player2, player1, updatedSession, opponent2));
      } catch (error) {
        this.queuePlayers.push(player1, player2);
        throw new Error(`Failed to create matchmaking room: ${error}`);
      }
    }
  }

  leaveQueue(userId: number) {
    this.queuePlayers = this.queuePlayers.filter(player => player.userId !== userId);
  }

  async handleMove(payload: { userId: number; gameId: number; x: number; y: number; server: Server }) {
    const { userId, gameId, x, y, server } = payload;

    if (x < 0 || x >= COLUMN_NUMBER || y < 0 || y >= ROW_NUMBER) {
      throw new BadRequestException('Invalid move coordinates');
    }

    try {
      const { session, player } = await this.sessionService.getOnlineGameSessionAndPlayer(gameId, userId);

      const opponent = await this.sessionService.getOnlineGameOpponent(gameId, userId);

      if (player.userId !== session.currentTurnUserId) {
        throw new BadRequestException('It is not your turn');
      }

      const userShips = getShipsFromBoard(opponent.board as unknown as Board);

      const appliedMove = applyMove(opponent.board as unknown as Board, userShips, { x, y });

      const winner = getMatchmakingWinner(appliedMove.newBoard, userId);

      const currentTurnUserId = appliedMove.result === 'miss' ? opponent.userId : userId;

      await this.sessionService.updateOnlineGamePlayer(gameId, opponent.userId, {
        board: appliedMove.newBoard as unknown as [],
      });

      await this.sessionService.updateOnlineGameSession(gameId, userId, { currentTurnUserId });

      if (winner) {
        await this.sessionService.updateOnlineGameSession(gameId, userId, { status: 'FINISHED', winnerUserId: winner });
      }

      server.to(player.socketId).emit('game:move:state', {
        currentTurnUserId,
        ...getMovePayload(player.board as unknown as Board, appliedMove.newBoard as unknown as Board, winner),
      });
      server.to(opponent.socketId).emit('game:move:state', {
        currentTurnUserId,
        ...getMovePayload(appliedMove.newBoard as unknown as Board, player.board as unknown as Board, winner),
      });
    } catch (error) {
      throw new Error(`Failed to handle move: ${error}`);
    }
  }
}
