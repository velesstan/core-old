import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RoleModel } from './interfaces';
import { RoleRef } from './schemas';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleRef) private readonly rolesModel: Model<RoleModel>,
  ) {}

  async find(): Promise<RoleModel[]> {
    return await this.rolesModel.find().exec();
  }
}
