import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_PROMPT } from './prompts/system-prompt';
import { AiMessage, AiTurnRequest, AiTurnResponse } from 'src/types/interfaces';

const AI_GAME_SESSION_EXPIRATION_TIME = 30 * 60 * 1000;

@Injectable()
export class AiGameService {
  private readonly openai: OpenAI;
  private readonly openaiModel: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });

    this.openaiModel = this.configService.getOrThrow<string>('OPENAI_MODEL');
  }

  async initializeAiGameSession(userId: number, playerBoard: [], aiBoard: []) {
    const expiresAt = new Date(Date.now() + AI_GAME_SESSION_EXPIRATION_TIME);

    const messages: AiMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    const session = await this.prisma.aiGameSession.create({
      data: {
        userId,
        playerBoard,
        aiBoard,
        messages,
        expiresAt,
      },
    });

    return session.id;
  }

  async sendUserTurn(sessionId: number, request: AiTurnRequest): Promise<AiTurnResponse> {
    const session = await this.prisma.aiGameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('AI game session not found');
    }

    const now = new Date();
    if (session.expiresAt <= now) {
      throw new BadRequestException('AI game session expired');
    }

    const storedMessages = (session.messages as AiMessage[]) ?? [];

    const userMessage: AiMessage = {
      role: 'user',
      content: JSON.stringify(request),
    };

    const completion = await this.openai.chat.completions.create({
      model: this.openaiModel,
      response_format: { type: 'json_object' },
      messages: [...storedMessages, userMessage],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new BadRequestException('AI returned empty response');
    }

    const parsedResponse = JSON.parse(content) as AiTurnResponse;

    if (!parsedResponse || typeof parsedResponse !== 'object') {
      throw new BadRequestException('AI returned invalid JSON');
    }

    if (
      typeof parsedResponse.target.x !== 'number' ||
      typeof parsedResponse.target.y !== 'number' ||
      typeof parsedResponse.message !== 'string'
    ) {
      throw new BadRequestException('AI returned response with invalid shape');
    }

    const assistantMessage: AiMessage = {
      role: 'assistant',
      content,
    };

    await this.prisma.aiGameSession.update({
      where: { id: sessionId },
      data: {
        messages: [...storedMessages, userMessage, assistantMessage],
      },
    });

    return parsedResponse;
  }

  async deleteAiGameSession(sessionId: number) {
    await this.prisma.aiGameSession.delete({
      where: { id: sessionId },
    });
  }
}
