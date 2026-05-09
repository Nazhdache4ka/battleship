import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AiGameService } from './ai-game.service';
import { StartAiGameDto } from './dto/start-ai-game.dto';
import { AiTurnDto } from './dto/ai-turn.dto';
import { AiTurnResponseDto } from './dto/ai-turn-response.dto';

@Controller('ai-game')
export class AiGameController {
  constructor(private readonly aiGameService: AiGameService) {}

  @ApiOperation({ summary: 'Initialize AI game session' })
  @ApiBody({ type: StartAiGameDto })
  @ApiCreatedResponse({ description: 'AI game session id', type: Number })
  @Post('start')
  startAiGame(@Body() startAiGameDto: StartAiGameDto) {
    return this.aiGameService.initializeAiGameSession(
      startAiGameDto.userId,
      startAiGameDto.playerBoard,
      startAiGameDto.aiBoard
    );
  }

  @ApiOperation({ summary: 'Send user turn to AI and get AI target' })
  @ApiBody({ type: AiTurnDto })
  @ApiOkResponse({ description: 'AI turn response', type: AiTurnResponseDto })
  @Post('turn/:sessionId')
  sendUserTurn(@Param('sessionId', ParseIntPipe) sessionId: number, @Body() aiTurnDto: AiTurnDto) {
    return this.aiGameService.sendUserTurn(sessionId, aiTurnDto);
  }

  @ApiOperation({ summary: 'Delete AI game session' })
  @ApiOkResponse({ description: 'AI game session deleted', type: Boolean })
  @Delete('session/:sessionId')
  deleteAiGameSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.aiGameService.deleteAiGameSession(sessionId);
  }
}
