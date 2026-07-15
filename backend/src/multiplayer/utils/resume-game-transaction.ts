import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

type ReconnectPlayerWithSession = Prisma.OnlineGamePlayerGetPayload<{
  include: { session: true; user: { select: { name: true; rating: true } } };
}>;

type ReconnectOpponent = Prisma.OnlineGamePlayerGetPayload<{
  include: { user: { select: { name: true; rating: true } } };
}>;

export async function resumeGameTransaction(
  prisma: PrismaService,
  userId: number,
  clientSocketId: string
): Promise<{
  reconnectPlayer: ReconnectPlayerWithSession;
  reconnectOpponent: ReconnectOpponent;
  reconnectPlayerRating: number;
  reconnectOpponentRating: number;
}> {
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
        user: {
          select: {
            name: true,
            rating: true,
          },
        },
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

    const reconnectOpponent: ReconnectOpponent | null = await tx.onlineGamePlayer.findFirst({
      where: {
        sessionId: reconnectPlayer.sessionId,
        userId: { not: userId },
      },
      include: {
        user: {
          select: {
            name: true,
            rating: true,
          },
        },
      },
    });

    if (!reconnectOpponent) {
      throw new Error('Opponent not found for active game');
    }

    await tx.onlineGamePlayer.update({
      where: { id: reconnectPlayer.id },
      data: { socketId: clientSocketId },
    });

    return {
      reconnectPlayer,
      reconnectOpponent,
      reconnectPlayerRating: reconnectPlayer.user.rating,
      reconnectOpponentRating: reconnectOpponent.user.rating,
    };
  });
}
