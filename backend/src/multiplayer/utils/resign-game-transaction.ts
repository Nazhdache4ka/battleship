import { OnlineGamePlayer, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

type ReconnectPlayerWithSession = Prisma.OnlineGamePlayerGetPayload<{
  include: { session: true };
}>;

export async function resignGameTransaction(
  prisma: PrismaService,
  userId: number
): Promise<{ resignPlayer: ReconnectPlayerWithSession; opponent: OnlineGamePlayer; winnerUserId: number | null }> {
  const now = new Date();

  return prisma.$transaction(async tx => {
    const resignPlayer: ReconnectPlayerWithSession | null = await tx.onlineGamePlayer.findFirst({
      where: {
        userId,
        session: {
          status: 'ACTIVE',
          expiresAt: { gt: now },
        },
      },
      include: {
        session: true,
      },
      orderBy: {
        session: {
          updatedAt: 'desc',
        },
      },
    });

    if (!resignPlayer) {
      throw new Error('No active game to resign');
    }

    const opponent: OnlineGamePlayer | null = await tx.onlineGamePlayer.findFirst({
      where: {
        sessionId: resignPlayer.sessionId,
        userId: { not: userId },
      },
    });

    if (!opponent) {
      throw new Error('Opponent not found for active game');
    }

    const winnerUserId: number | null = opponent.userId;

    await tx.onlineGameSession.update({
      where: { id: resignPlayer.sessionId },
      data: {
        status: 'FINISHED',
        winnerUserId,
        currentTurnUserId: null,
      },
    });

    return { resignPlayer, opponent, winnerUserId };
  });
}
