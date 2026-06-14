import { ApiProperty } from '@nestjs/swagger';
import type { User } from 'src/generated/prisma/client';
import type { Role } from 'src/generated/prisma/enums';

type UserResponseSource = Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'rating' | 'role' | 'boardPreset'>;

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

  @ApiProperty({
    description: "User's board preset",
    example: '[{"x": 0, "y": 0, "shipId": null, "state": "empty"}, ...]',
  })
  boardPreset: User['boardPreset'];

  constructor(user: UserResponseSource) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.rating = user.rating;
    this.role = user.role;
    this.boardPreset = user.boardPreset;
  }
}
