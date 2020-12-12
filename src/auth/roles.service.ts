import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IRoleModel } from './interfaces';
import { RoleRef } from './schemas';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleRef) private readonly rolesModel: Model<IRoleModel>,
  ) {}

  async findAll(): Promise<IRoleModel[]> {
    return await this.rolesModel.find().exec();
  }

  async removeById(id: string): Promise<void> {
    await this.rolesModel.findByIdAndRemove(id).exec();
  }
}
