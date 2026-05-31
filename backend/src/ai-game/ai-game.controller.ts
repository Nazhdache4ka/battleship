import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AiGameService } from './ai-game.service';
import { StartAiGameDto } from './dto/start-ai-game.dto';
import { AiTurnResponseDto } from './dto/ai-turn-response.dto';
import { Coordinates } from 'src/types/interfaces';

@Controller('ai-game')
export class AiGameController {
  constructor(private readonly aiGameService: AiGameService) {}

  @ApiOperation({ summary: 'Initialize AI game session' })
  @ApiBody({ type: StartAiGameDto })
  @ApiCreatedResponse({ description: 'AI game session id', type: Number })
  @Post('start')
  startAiGame(@Body() startAiGameDto: StartAiGameDto) {
    return this.aiGameService.initializeAiGameSession(startAiGameDto.userId, startAiGameDto.playerBoard);
  }

  @ApiOperation({ summary: 'Send user turn to AI and get AI target' })
  @ApiOkResponse({ description: 'AI turn response', type: AiTurnResponseDto })
  @Post('turn/:sessionId')
  triggerAiTurns(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.aiGameService.triggerAiTurns(sessionId);
  }

  @ApiOperation({ summary: 'Apply user turn to AI and get AI response' })
  @ApiOkResponse({ description: 'AI turn response', type: AiTurnResponseDto })
  @Post('apply-turn/:sessionId')
  applyUserTurn(@Param('sessionId', ParseIntPipe) sessionId: number, @Body() target: { target: Coordinates }) {
    return this.aiGameService.applyUserTurn(sessionId, target.target);
  }

  @ApiOperation({ summary: 'Delete AI game session' })
  @ApiOkResponse({ description: 'AI game session deleted', type: Boolean })
  @Delete('session/:sessionId')
  deleteAiGameSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.aiGameService.deleteAiGameSession(sessionId);
  }
}
