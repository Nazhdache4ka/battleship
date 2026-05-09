import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class StartAiGameDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: 'Player board snapshot',
    type: 'array',
    example: [[{ x: 0, y: 0, shipId: null, state: 'empty' }]],
  })
  @IsArray()
  playerBoard: [];

  @ApiProperty({
    description: 'AI board snapshot',
    type: 'array',
    example: [[{ x: 0, y: 0, shipId: null, state: 'empty' }]],
  })
  @IsArray()
  aiBoard: [];
}
