import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';

import { CreateUserDto } from './dto';
import { UserModel } from './interfaces';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/')
  async getAll(): Promise<UserModel[]> {
    return await this.userService.find();
  }

  @Post('/')
  async create(@Body() user: CreateUserDto): Promise<UserModel> {
    return await this.userService.create(user);
  }
}
