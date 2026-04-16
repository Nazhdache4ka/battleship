import { ApiProperty } from '@nestjs/swagger';
import type { User } from 'src/generated/prisma/client';
import type { Role } from 'src/generated/prisma/enums';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '2026-04-08T19:30:19.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 1000 })
  rating: number;

  @ApiProperty({ enum: ['USER', 'ADMIN'], example: 'USER' })
  role: Role;

  constructor(user: Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'rating' | 'role'>) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.rating = user.rating;
    this.role = user.role;
  }
}
