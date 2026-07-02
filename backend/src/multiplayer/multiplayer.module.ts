import { Module } from '@nestjs/common';
import { MultiplayerGateway } from './multiplayer.gateway';
import { MultiplayerService } from './multiplayer.service';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [AuthModule, TokenModule, SessionModule],
  providers: [MultiplayerGateway, MultiplayerService],
  exports: [MultiplayerGateway],
})
export class MultiplayerModule {}
