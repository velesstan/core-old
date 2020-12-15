import { Controller, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RoleService } from './role.service';

import { RoleModel } from './interfaces';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth/roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<RoleModel[]> {
    return await this.rolesService.find();
  }
}
