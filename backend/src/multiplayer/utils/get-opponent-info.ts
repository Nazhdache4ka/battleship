import { PrismaService } from 'src/prisma.service';

export async function getOpponentInfo(userId: number, prisma: PrismaService, rating: number) {
  const opponent = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
    },
  });

  if (!opponent) {
    throw new Error('Opponent not found');
  }

  return {
    name: opponent.name,
    rating,
  };
}
