import { PrismaService } from 'src/prisma.service';

export async function getOpponentInfo(userId: number, prisma: PrismaService) {
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

  return opponent;
}
