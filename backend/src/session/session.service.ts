import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AiGameSession, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async validateOwnershipAndExpirationAiGameSession(sessionId: number, userId: number): Promise<void> {
    const session = await this.prisma.aiGameSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) {
      throw new NotFoundException('AI session not found');
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException('Unauthorized access to AI session');
    }
  }

  async deleteAiGameSession(sessionId: number, userId: number): Promise<void> {
    await this.validateOwnershipAndExpirationAiGameSession(sessionId, userId);

    await this.prisma.aiGameSession.delete({
      where: { id: sessionId },
    });
  }

  async getAiGameSession(sessionId: number, userId: number): Promise<AiGameSession> {
    await this.validateOwnershipAndExpirationAiGameSession(sessionId, userId);

    return this.prisma.aiGameSession.findUniqueOrThrow({
      where: { id: sessionId },
    });
  }

  async updateAiGameSession(
    sessionId: number,
    userId: number,
    data: Prisma.AiGameSessionUpdateInput
  ): Promise<AiGameSession> {
    await this.validateOwnershipAndExpirationAiGameSession(sessionId, userId);

    if (!this.hasUpdateData(data)) {
      return this.prisma.aiGameSession.findUniqueOrThrow({
        where: { id: sessionId },
      });
    }

    return this.prisma.aiGameSession.update({
      where: { id: sessionId },
      data,
    });
  }

  async updateAiGameSessionOptimistic(
    sessionId: number,
    userId: number,
    expectedUpdatedAt: Date,
    data: Prisma.AiGameSessionUpdateInput
  ): Promise<void> {
    await this.validateOwnershipAndExpirationAiGameSession(sessionId, userId);

    if (!this.hasUpdateData(data)) {
      return;
    }

    const updateResult = await this.prisma.aiGameSession.updateMany({
      where: {
        id: sessionId,
        userId,
        updatedAt: expectedUpdatedAt,
      },
      data,
    });

    if (updateResult.count !== 1) {
      throw new ConflictException('AI game session was updated concurrently, please retry turn');
    }
  }

  private hasUpdateData(data: Prisma.AiGameSessionUpdateInput): boolean {
    return Object.keys(data).length > 0;
  }
}
