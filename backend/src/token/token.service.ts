import { createHash } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { getUserAgent } from 'src/utils/get-user-agent';

const REFRESH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async generateTokens(user: Pick<User, 'id' | 'email'>) {
    const payload = { id: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  saveRefreshToken(userId: number, refreshToken: string, userAgent: string, ip: string) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    const ua = getUserAgent(userAgent);

    return this.prisma.refreshToken.create({
      data: {
        userId,
        refreshToken: tokenHash,
        userAgent: ua,
        ip,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_TIME),
      },
    });
  }

  async findSession(userAgent: string, userId: number) {
    const ua = getUserAgent(userAgent);

    const session = await this.prisma.refreshToken.findFirst({
      where: { userAgent: ua, userId },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      return null;
    }

    return session;
  }

  async removeRefreshToken(refreshToken: string) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    await this.prisma.refreshToken.deleteMany({
      where: { refreshToken: tokenHash },
    });
  }

  async removeRefreshTokenByHash(tokenHash: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { refreshToken: tokenHash },
    });
  }

  async verifyRefreshToken(refreshToken: string, userAgent: string, ip: string) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.prisma.refreshToken.findFirst({
      where: { refreshToken: tokenHash },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const decodedToken: Pick<User, 'id' | 'email'> = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.id },
      omit: { password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.removeRefreshToken(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.generateTokens(decodedToken);

    await this.saveRefreshToken(decodedToken.id, newRefreshToken, userAgent, ip);

    return { newAccessToken, newRefreshToken, user };
  }
}
