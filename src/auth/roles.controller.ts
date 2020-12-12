import { Controller, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RolesService } from './roles.service';

import { IRoleModel } from './interfaces';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth/roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<IRoleModel[]> {
    return await this.rolesService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeById(@Param('id') id: string): Promise<void> {
    return await this.rolesService.removeById(id);
  }
}
