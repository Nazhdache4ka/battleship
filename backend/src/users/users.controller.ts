import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PatchNameDto, PatchEmailDto, PatchPasswordDto } from './dto/patch-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiCreatedResponse({ description: 'The user has been successfully created', type: UserResponseDto })
  @ApiBody({ type: CreateUserDto })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Get all existing users' })
  @ApiOkResponse({ description: 'The users have been successfully fetched', type: UserResponseDto, isArray: true })
  @Get()
  @UseGuards(AuthGuard)
  fetchAllUsers() {
    return this.usersService.fetchAllUsers();
  }

  @ApiOperation({ summary: 'Get user board preset' })
  @ApiOkResponse({ description: 'The user board preset has been successfully fetched' })
  @Get('board-preset')
  @UseGuards(AuthGuard)
  getUserBoardPreset(@Req() request: Request) {
    return this.usersService.getUserBoardPreset(request.user!.id);
  }

  @ApiOperation({ summary: 'Save user board preset' })
  @ApiBody({ type: 'array' })
  @ApiOkResponse({ description: 'The user board preset has been successfully saved', type: Boolean })
  @Post('board-preset')
  @UseGuards(AuthGuard)
  saveUserBoardPreset(@Body() boardPreset: [], @Req() request: Request) {
    return this.usersService.saveUserBoardPreset(boardPreset, request.user!.id);
  }

  @ApiOperation({ summary: 'Get leaderboard' })
  @Get('leaderboard')
  async getLeaderboard() {
    return await this.usersService.getLeaderboard();
  }

  @ApiOperation({ summary: 'Get rating history' })
  @ApiOkResponse({
    description: 'The rating history has been successfully fetched',
    isArray: true,
  })
  @Get(':userId/rating-history')
  async getRatingHistory(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getRatingHistory(userId);
  }

  @ApiOperation({ summary: 'Get me' })
  @ApiOkResponse({ description: 'The me has been successfully fetched', type: UserResponseDto })
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() request: Request) {
    return this.usersService.getMe(request.user!.id);
  }

  @ApiOperation({ summary: 'Patch user name' })
  @ApiBody({ type: PatchNameDto })
  @ApiOkResponse({ description: 'The user name has been successfully patched', type: UserResponseDto })
  @Patch('me/name')
  @UseGuards(AuthGuard)
  patchUserName(@Body() patchNameDto: PatchNameDto, @Req() request: Request) {
    return this.usersService.patchUserName(request.user!.id, patchNameDto.name);
  }

  @ApiOperation({ summary: 'Patch user email' })
  @ApiBody({ type: PatchEmailDto })
  @ApiOkResponse({ description: 'The user email has been successfully patched', type: UserResponseDto })
  @Patch('me/email')
  @UseGuards(AuthGuard)
  patchUserEmail(@Body() patchEmailDto: PatchEmailDto, @Req() request: Request) {
    return this.usersService.patchUserEmail(request.user!.id, patchEmailDto.email);
  }

  @ApiOperation({ summary: 'Patch user password' })
  @ApiBody({ type: PatchPasswordDto })
  @ApiOkResponse({ description: 'The user password has been successfully patched', type: UserResponseDto })
  @Patch('me/password')
  @UseGuards(AuthGuard)
  patchUserPassword(@Body() patchPasswordDto: PatchPasswordDto, @Req() request: Request) {
    return this.usersService.patchUserPassword(request.user!.id, patchPasswordDto.password);
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiOkResponse({ description: 'The user info has been successfully fetched', type: UserResponseDto })
  @Get(':userId')
  async getUserInfo(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getUserInfo(userId);
  }
}
