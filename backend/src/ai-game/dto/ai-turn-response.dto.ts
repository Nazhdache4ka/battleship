import { ApiProperty } from '@nestjs/swagger';

class AiTargetDto {
  @ApiProperty({ example: 3 })
  x: number;

  @ApiProperty({ example: 8 })
  y: number;
}

export class AiTurnResponseDto {
  @ApiProperty({ type: AiTargetDto })
  target: AiTargetDto;

  @ApiProperty({ example: 'I am targeting your lower-left quadrant.' })
  message: string;
}
