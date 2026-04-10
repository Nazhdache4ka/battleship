import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [forwardRef(() => UsersModule), TokenModule],
  exports: [AuthGuard, TokenModule],
})
export class AuthModule {}
