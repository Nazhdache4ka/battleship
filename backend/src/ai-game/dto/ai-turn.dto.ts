import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsObject, Max, Min, ValidateNested } from 'class-validator';

class AiShotHistoryItemDto {
  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(0)
  @Max(9)
  x: number;

  @ApiProperty({ example: 6 })
  @IsInt()
  @Min(0)
  @Max(9)
  y: number;

  @ApiProperty({ enum: ['hit', 'miss', 'sunk'], example: 'hit' })
  @IsIn(['hit', 'miss', 'sunk'])
  result: 'hit' | 'miss' | 'sunk';
}

class AiBoardDto {
  @ApiProperty({
    type: 'array',
    example: [
      ['unknown', 'miss'],
      ['hit', 'unknown'],
    ],
  })
  @IsArray()
  playerBoardForAi: ('unknown' | 'hit' | 'miss')[][];

  @ApiProperty({ type: [AiShotHistoryItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiShotHistoryItemDto)
  aiShotHistory: AiShotHistoryItemDto[];
}

class AiRulesDto {
  @ApiProperty({ example: true })
  keepTurnOnHit: true;

  @ApiProperty({ example: true })
  keepTurnOnSunk: true;
}

export class AiTurnDto {
  @ApiProperty({ type: AiBoardDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AiBoardDto)
  board: AiBoardDto;

  @ApiProperty({ type: AiRulesDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AiRulesDto)
  rules: AiRulesDto;
}
