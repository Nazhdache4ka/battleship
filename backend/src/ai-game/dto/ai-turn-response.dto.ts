import { ApiProperty } from '@nestjs/swagger';
import { CellState } from 'src/types/interfaces';

class AiTargetDto {
  @ApiProperty({ example: 3 })
  x: number;

  @ApiProperty({ example: 8 })
  y: number;
}

class CellDto {
  @ApiProperty({ example: 3 })
  x: number;

  @ApiProperty({ example: 8 })
  y: number;

  @ApiProperty({ example: '1' })
  shipId: string | null;

  @ApiProperty({ example: 'unknown' })
  state: CellState;
}

class IShipDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  size: number;
}

class ShipsDto {
  @ApiProperty({ type: [IShipDto] })
  ships: IShipDto[];
}

export class AiTurnResponseDto {
  @ApiProperty({ type: [CellDto] })
  board: CellDto[][];

  @ApiProperty({ type: ShipsDto })
  ships: ShipsDto;

  @ApiProperty({ example: 'hit' })
  result: 'hit' | 'miss' | 'sunk';

  @ApiProperty({ type: AiTargetDto })
  target?: AiTargetDto;

  @ApiProperty({ example: 'I am targeting your lower-left quadrant.' })
  message: string;
}
