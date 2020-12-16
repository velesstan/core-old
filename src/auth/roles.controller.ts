import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RoleService } from './role.service';

import { RoleModel } from './interfaces';
import { JwtAuthGuard } from './guards';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth/roles')
export class RolesController {
  constructor(private readonly rolesService: RoleService) {}

  @Get()
  async getAll(): Promise<RoleModel[]> {
    return await this.rolesService.find();
  }
}
