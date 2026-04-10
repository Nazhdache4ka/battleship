import { ApiProperty } from '@nestjs/swagger';
import type { User } from 'src/generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '2026-04-08T19:30:19.000Z' })
  createdAt: Date;

  constructor(user: Pick<User, 'id' | 'name' | 'email' | 'createdAt'>) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
