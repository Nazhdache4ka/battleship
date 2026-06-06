import { Body, Controller, Delete, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AiGameService } from './ai-game.service';
import { StartAiGameDto } from './dto/start-ai-game.dto';
import { AiTurnResponseDto } from './dto/ai-turn-response.dto';
import { Coordinates } from 'src/types/interfaces';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@Controller('ai-game')
export class AiGameController {
  constructor(private readonly aiGameService: AiGameService) {}

  @ApiOperation({ summary: 'Initialize AI game session' })
  @ApiBody({ type: StartAiGameDto })
  @ApiCreatedResponse({ description: 'AI game session id', type: Number })
  @Post('start')
  @UseGuards(AuthGuard)
  startAiGame(@Body() startAiGameDto: StartAiGameDto, @Req() request: Request) {
    return this.aiGameService.initializeAiGameSession(request.user!.id, startAiGameDto.playerBoard);
  }

  @ApiOperation({ summary: 'Send user turn to AI and get AI target' })
  @ApiOkResponse({ description: 'AI turn response', type: AiTurnResponseDto })
  @Post('turn/:sessionId')
  @UseGuards(AuthGuard)
  triggerAiTurns(@Param('sessionId', ParseIntPipe) sessionId: number, @Req() request: Request) {
    return this.aiGameService.triggerAiTurns(sessionId, request.user!.id);
  }

  @ApiOperation({ summary: 'Apply user turn to AI and get AI response' })
  @ApiOkResponse({ description: 'AI turn response', type: AiTurnResponseDto })
  @Post('apply-turn/:sessionId')
  @UseGuards(AuthGuard)
  applyUserTurn(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() target: { target: Coordinates },
    @Req() request: Request
  ) {
    return this.aiGameService.applyUserTurn(sessionId, request.user!.id, target.target);
  }

  @ApiOperation({ summary: 'Delete AI game session' })
  @ApiOkResponse({ description: 'AI game session deleted', type: Boolean })
  @Delete('session/:sessionId')
  @UseGuards(AuthGuard)
  deleteAiGameSession(@Param('sessionId', ParseIntPipe) sessionId: number, @Req() request: Request) {
    return this.aiGameService.deleteAiGameSession(sessionId, request.user!.id);
  }
}
