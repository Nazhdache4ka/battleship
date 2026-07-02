import { PrismaService } from 'src/prisma.service';
import { IQueuePlayer } from 'src/types/interfaces';

const SESSION_EXPIRATION_TIME = 1000 * 60 * 30; // 30 minutes

export async function createMatchmakingSession(player1: IQueuePlayer, player2: IQueuePlayer, prisma: PrismaService) {
  try {
    const session = await prisma.$transaction(async tx => {
      const session = await tx.onlineGameSession.create({
        data: {
          status: 'WAITING',
          expiresAt: new Date(Date.now() + SESSION_EXPIRATION_TIME),
        },
      });

      if (!session) {
        throw new Error('Failed to create matchmaking session');
      }

      await tx.onlineGamePlayer.createMany({
        data: [
          {
            sessionId: session.id,
            userId: player1.userId,
            board: player1.board as unknown as [],
            socketId: player1.socketId,
            slot: 'FIRST',
          },
          {
            sessionId: session.id,
            userId: player2.userId,
            board: player2.board as unknown as [],
            socketId: player2.socketId,
            slot: 'SECOND',
          },
        ],
      });

      return session;
    });

    return session;
  } catch (error) {
    throw new Error(`Failed to create matchmaking session: ${error}`);
  }
}
