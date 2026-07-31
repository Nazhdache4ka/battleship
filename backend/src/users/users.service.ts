import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
      omit: { password: true },
    });

    return user;
  }

  async fetchAllUsers() {
    const users = await this.prisma.user.findMany({
      omit: { password: true },
    });

    return users;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async getUserBoardPreset(userId: number) {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { boardPreset: true },
    });

    if (!row) {
      return [];
    }

    const boardPreset = row.boardPreset;
    return boardPreset;
  }

  async saveUserBoardPreset(boardPreset: [], userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { boardPreset },
    });

    return true;
  }

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        rating: true,
        createdAt: true,
      },
      orderBy: [
        {
          rating: 'desc',
        },
        {
          id: 'asc',
        },
      ],
      take: 10,
    });

    return users;
  }

  async getRatingHistory(userId: number) {
    const ratingHistory = await this.prisma.userRatingHistory.findMany({
      where: { userId: Number(userId) },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return ratingHistory;
  }

  async getUserInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { name: true, rating: true, createdAt: true },
    });

    return user;
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { name: true, rating: true, createdAt: true, email: true, id: true },
    });

    return user;
  }

  async patchUserName(userId: number, name: string) {
    await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { name },
    });
  }

  async patchUserEmail(userId: number, email: string) {
    try {
      await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { email },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }

      throw error;
    }
  }

  async patchUserPassword(userId: number, password: string) {
    const hashPassword = await bcryptjs.hash(password, 10);

    await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashPassword },
    });
  }
}
