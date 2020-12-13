import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserModel } from './interfaces';
import { UserService } from './user.service';

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
