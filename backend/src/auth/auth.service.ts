import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

const USER_AGENT_MAX_LENGTH = 255;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) {}

  async login(userDto: AuthLoginDto, userAgent: string, ip: string) {
    const user = await this.validateUser(userDto);

    const ua =
      typeof userAgent === 'string'
        ? userAgent.length > USER_AGENT_MAX_LENGTH
          ? userAgent.slice(0, USER_AGENT_MAX_LENGTH)
          : userAgent
        : '';

    const session = await this.tokenService.findSession(ua, user.id);

    if (session) {
      await this.tokenService.removeRefreshTokenByHash(session.refreshToken);
    }

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user);
    await this.tokenService.saveRefreshToken(user.id, refreshToken, ua, ip);

    const loggedInUser = new UserResponseDto(user);

    return { accessToken, refreshToken, loggedInUser };
  }

  async register(userDto: CreateUserDto, userAgent: string, ip: string) {
    const user = await this.usersService.findUserByEmail(userDto.email);

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashPassword = await bcryptjs.hash(userDto.password, 10);
    const newUser = await this.usersService.createUser({ ...userDto, password: hashPassword });

    const ua =
      typeof userAgent === 'string'
        ? userAgent.length > USER_AGENT_MAX_LENGTH
          ? userAgent.slice(0, USER_AGENT_MAX_LENGTH)
          : userAgent
        : '';

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(newUser);
    await this.tokenService.saveRefreshToken(newUser.id, refreshToken, ua, ip);

    const registeredUser = new UserResponseDto(newUser);

    return { accessToken, refreshToken, registeredUser };
  }

  async logout(refreshToken: string) {
    await this.tokenService.removeRefreshToken(refreshToken);
  }

  private async validateUser(userDto: AuthLoginDto) {
    const user = await this.usersService.findUserByEmail(userDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid password or email address');
    }

    const isPasswordValid = await bcryptjs.compare(userDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password or email address');
    }

    return user;
  }

  async refresh(refreshToken: string, userAgent: string, ip: string) {
    const { newAccessToken, newRefreshToken, user } = await this.tokenService.verifyRefreshToken(
      refreshToken,
      userAgent,
      ip
    );

    const refreshedUser = new UserResponseDto(user);

    return { newAccessToken, newRefreshToken, refreshedUser };
  }
}
