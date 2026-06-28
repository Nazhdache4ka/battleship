import { Module } from '@nestjs/common';
import { MultiplayerGateway } from './multiplayer.gateway';
import { MultiplayerService } from './multiplayer.service';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [AuthModule, TokenModule],
  providers: [MultiplayerGateway, MultiplayerService],
  exports: [MultiplayerGateway],
})
export class MultiplayerModule {}
