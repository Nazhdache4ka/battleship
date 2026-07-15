import { OnlineGamePlayer, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

type ResignPlayer = Prisma.OnlineGamePlayerGetPayload<{
  select: { sessionId: true; socketId: true; board: true; userId: true };
}>;

export async function resignGameTransaction(
  prisma: PrismaService,
  userId: number
): Promise<{ resignPlayer: ResignPlayer; opponent: OnlineGamePlayer; winnerUserId: number }> {
  const now = new Date();

  return prisma.$transaction(async tx => {
    const resignPlayer: ResignPlayer | null = await tx.onlineGamePlayer.findFirst({
      where: {
        userId,
        session: {
          status: 'ACTIVE',
          expiresAt: { gt: now },
        },
      },
      select: {
        sessionId: true,
        socketId: true,
        board: true,
        userId: true,
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

    const winnerUserId = opponent.userId;

    return { resignPlayer, opponent, winnerUserId };
  });
}
