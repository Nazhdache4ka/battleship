import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AppSocket } from 'src/types/app-socket';
import { Board, IQueuePlayer } from 'src/types/interfaces';
import { createMatchmakingSession } from './utils/create-matchmaking-session';
import { Server } from 'socket.io';
import { createMatchmakingRoom } from './utils/create-matchmaking-room';

@Injectable()
export class MultiplayerService {
  private queuePlayers: IQueuePlayer[] = [];
  constructor(private readonly prisma: PrismaService) {}

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
        await createMatchmakingRoom(player1, player2, server, this.prisma, session);
      } catch {
        this.queuePlayers.push(player1, player2);
      }
    }
  }

  leaveQueue(userId: number) {
    this.queuePlayers = this.queuePlayers.filter(player => player.userId !== userId);
  }
}
