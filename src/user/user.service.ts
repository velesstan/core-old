import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRef } from './schemas';
import { IUserModel } from './interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserRef) private userModel: Model<IUserModel>) {
    this.bootstrap();
  }

  async bootstrap() {
    const draftUser = await this.userModel
      .findOne({
        email: 'admin@veles.services',
      })
      .exec();
    if (!draftUser) {
      await this.create({
        email: 'admin@veles.services',
        password: 'admin',
      });
    }
  }

  async create(user: CreateUserDto): Promise<IUserModel> {
    return await new this.userModel(user).save();
  }

  async update(id: string, user: UpdateUserDto): Promise<IUserModel> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }

  async find(): Promise<IUserModel[]> {
    return await this.userModel.find({}).exec();
  }

  async remove(id: string): Promise<IUserModel> {
    return await this.userModel.findByIdAndRemove(id).exec();
  }

  async findOneByEmail(email: string): Promise<IUserModel> {
    return await this.userModel.findOne({ email: email }).exec();
  }
}
