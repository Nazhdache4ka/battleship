import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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
}
