import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class StartAiGameDto {
  @ApiProperty({
    description: 'Player board snapshot',
    type: 'array',
    example: [[{ x: 0, y: 0, shipId: null, state: 'empty' }]],
  })
  @IsArray()
  playerBoard: [];
}
