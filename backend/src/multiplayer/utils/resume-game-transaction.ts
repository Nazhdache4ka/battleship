import { OnlineGamePlayer, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

type ReconnectPlayerWithSession = Prisma.OnlineGamePlayerGetPayload<{
  include: { session: true };
}>;

export async function resumeGameTransaction(
  prisma: PrismaService,
  userId: number,
  clientSocketId: string
): Promise<{ reconnectPlayer: ReconnectPlayerWithSession; reconnectOpponent: OnlineGamePlayer }> {
  const now = new Date();

  return prisma.$transaction(async tx => {
    await tx.onlineGameSession.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lte: now },
        players: {
          some: { userId },
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    const reconnectPlayer: ReconnectPlayerWithSession | null = await tx.onlineGamePlayer.findFirst({
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

    if (!reconnectPlayer) {
      throw new Error('Player not found for active game');
    }

    const reconnectOpponent: OnlineGamePlayer | null = await tx.onlineGamePlayer.findFirst({
      where: {
        sessionId: reconnectPlayer.sessionId,
        userId: { not: userId },
      },
    });

    if (!reconnectOpponent) {
      throw new Error('Opponent not found for active game');
    }

    await tx.onlineGamePlayer.update({
      where: { id: reconnectPlayer.id },
      data: { socketId: clientSocketId },
    });

    return { reconnectPlayer, reconnectOpponent };
  });
}
