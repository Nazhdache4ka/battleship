import { Server } from 'socket.io';
import { OnlineGameSession } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { IQueuePlayer } from 'src/types/interfaces';

export async function createMatchmakingRoom(
  player1: IQueuePlayer,
  player2: IQueuePlayer,
  server: Server,
  prisma: PrismaService,
  session: OnlineGameSession
) {
  const roomId = `game:${session.id}`;

  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await server.in(player1.socketId).socketsJoin(roomId);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await server.in(player2.socketId).socketsJoin(roomId);

    const updatedSession = await prisma.onlineGameSession.update({
      where: { id: session.id },
      data: {
        status: 'ACTIVE',
        currentTurnUserId: player1.userId,
        players: {
          update: [
            {
              where: { sessionId_userId: { sessionId: session.id, userId: player1.userId } },
              data: { isReady: true },
            },
            {
              where: { sessionId_userId: { sessionId: session.id, userId: player2.userId } },
              data: { isReady: true },
            },
          ],
        },
      },
    });

    const player1Rating = await prisma.user.findUnique({
      where: { id: player1.userId },
      select: {
        rating: true,
      },
    });

    const player2Rating = await prisma.user.findUnique({
      where: { id: player2.userId },
      select: {
        rating: true,
      },
    });

    if (!player1Rating || !player2Rating) {
      throw new Error('Failed to get player ratings');
    }

    return {
      roomId,
      session: updatedSession,
      player1Rating: player1Rating.rating,
      player2Rating: player2Rating.rating,
    };
  } catch (error) {
    await prisma.onlineGameSession.delete({
      where: { id: session.id },
    });

    server.to(player1.socketId).emit('game:error', {
      message: 'Failed to create matchmaking room',
    });

    server.to(player2.socketId).emit('game:error', {
      message: 'Failed to create matchmaking room',
    });

    throw new Error(`Failed to create matchmaking room: ${error}`);
  }
}
