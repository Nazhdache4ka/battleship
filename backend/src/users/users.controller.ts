import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
