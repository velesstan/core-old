import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';

import { CreateUserDto, UpdateUserDto } from './dto';
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

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.userService.updateById(id, user);
  }
}
