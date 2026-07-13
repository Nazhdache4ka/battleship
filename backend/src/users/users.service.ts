import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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
}
