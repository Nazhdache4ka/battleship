import { Module } from '@nestjs/common';
import { AiGameController } from './ai-game.controller';
import { AiGameService } from './ai-game.service';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AiGameController],
  providers: [AiGameService],
  imports: [PrismaModule, AuthModule],
})
export class AiGameModule {}
