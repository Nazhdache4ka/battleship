import { RATING_DELTA } from 'src/models/basic-constants';
import { PrismaService } from 'src/prisma.service';

export type WinnerTransactionResult = {
  winner: number;
  loser: number;
};

export async function winnerTransaction(
  prisma: PrismaService,
  gameId: number,
  winnerUserId: number
): Promise<WinnerTransactionResult> {
  return prisma.$transaction(async tx => {
    const session = await tx.onlineGameSession.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (session.players.length !== 2) {
      throw new Error('Invalid number of players');
    }

    const winnerPlayer = session.players.find(player => player.userId === winnerUserId);
    const loserPlayer = session.players.find(player => player.userId !== winnerUserId);

    if (!winnerPlayer || !loserPlayer) {
      throw new Error('Player not found');
    }

    if (session.status === 'FINISHED') {
      if (session.winnerUserId !== winnerUserId) {
        throw new Error('Session already finished with a different winner');
      }

      return {
        winner: winnerPlayer.user.rating,
        loser: loserPlayer.user.rating,
      };
    }

    await tx.onlineGameSession.update({
      where: { id: gameId },
      data: {
        status: 'FINISHED',
        winnerUserId,
        currentTurnUserId: null,
      },
    });

    const winnerNewRating = winnerPlayer.user.rating + RATING_DELTA;
    const loserNewRating = Math.max(0, loserPlayer.user.rating - RATING_DELTA);

    await tx.user.update({
      where: { id: winnerPlayer.userId },
      data: { rating: winnerNewRating },
    });

    await tx.user.update({
      where: { id: loserPlayer.userId },
      data: { rating: loserNewRating },
    });

    await tx.userRatingHistory.create({
      data: {
        userId: winnerPlayer.userId,
        rating: winnerNewRating,
      },
    });

    await tx.userRatingHistory.create({
      data: {
        userId: loserPlayer.userId,
        rating: loserNewRating,
      },
    });

    return {
      winner: winnerNewRating,
      loser: loserNewRating,
    };
  });
}
