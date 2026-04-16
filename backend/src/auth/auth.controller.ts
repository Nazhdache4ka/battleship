import { Body, Controller, Post, Ip, Headers, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthSessionResponseDto } from './dto/auth-session-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

const REFRESH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOkResponse({
    description: 'The user has been successfully logged in',
    type: AuthSessionResponseDto,
  })
  @ApiBody({ type: AuthLoginDto })
  @Post('login')
  async login(
    @Body() userDto: AuthLoginDto,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const {
      accessToken,
      refreshToken,
      loggedInUser: user,
    } = await this.authService.login(userDto, userAgent ?? '', ip);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      path: '/',
    });

    return { accessToken, user };
  }

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiOkResponse({
    description: 'The user has been successfully registered',
    type: AuthSessionResponseDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(
    @Body() userDto: CreateUserDto,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const {
      accessToken,
      refreshToken,
      registeredUser: user,
    } = await this.authService.register(userDto, userAgent ?? '', ip);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      path: '/',
    });
    return { accessToken, user };
  }

  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOkResponse({ description: 'The user has been successfully logged out', example: true })
  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    // eslint-disable-next-line
    const token = request.cookies['refreshToken'];

    if (typeof token === 'string' && token.length > 0) {
      await this.authService.logout(token);
    }

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      path: '/',
    });

    return { ok: true };
  }

  @ApiOperation({
    summary: 'Refresh session',
    description:
      'Requires the httpOnly `refreshToken` cookie. Returns a new access token in the body and sets a new refresh token via `Set-Cookie`. Client must use `credentials: "include"`.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing cookie, invalid or expired refresh token',
  })
  @ApiOkResponse({
    description: 'New access token; refresh token updated via Set-Cookie',
    type: AuthSessionResponseDto,
  })
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ip: string
  ) {
    // eslint-disable-next-line
    const rawRefresh = request.cookies['refreshToken'];

    if (typeof rawRefresh !== 'string' || rawRefresh.length === 0) {
      throw new UnauthorizedException('Refresh token cookie is missing');
    }

    const { newAccessToken, newRefreshToken, refreshedUser } = await this.authService.refresh(
      rawRefresh,
      userAgent ?? '',
      ip
    );

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      path: '/',
    });

    return { accessToken: newAccessToken, user: refreshedUser };
  }
}
