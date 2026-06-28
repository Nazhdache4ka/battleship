import { PrismaService } from 'src/prisma.service';
import { IQueuePlayer } from 'src/types/interfaces';

export async function createMatchmakingSession(player1: IQueuePlayer, player2: IQueuePlayer, prisma: PrismaService) {
  try {
    const session = await prisma.$transaction(async tx => {
      const session = await tx.onlineGameSession.create({
        data: {
          status: 'WAITING',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
            slot: 'FIRST',
          },
          {
            sessionId: session.id,
            userId: player2.userId,
            board: player2.board as unknown as [],
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
