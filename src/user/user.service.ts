import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRef } from './schemas';
import { UserModel } from './interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserRef) private userModel: Model<UserModel>) {
    if (process.env.NODE_ENV === 'production') {
      this.bootstrap();
    }
  }
  async bootstrap(): Promise<void> {
    const draftUser = await this.userModel
      .findOne({
        email: 'admin@veles.services',
      })
      .exec();
    if (!draftUser) {
      await this.create({
        email: 'admin@veles.services',
        password: 'admin',
        firstName: 'Евгений',
        lastName: '',
        patronymic: '',
      });
    }
  }

  async create(user: CreateUserDto): Promise<UserModel> {
    return await new this.userModel(user).save();
  }

  async updateById(id: string, user: UpdateUserDto): Promise<UserModel> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }

  async find(): Promise<UserModel[]> {
    return await this.userModel.find({}).exec();
  }

  async removeById(id: string): Promise<UserModel> {
    return await this.userModel.findByIdAndRemove(id).exec();
  }

  async findById(id: string): Promise<UserModel> {
    return await this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<UserModel> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async setRefreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenExpires: Date,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: {
          refreshToken,
          refreshTokenExpires,
        },
      })
      .exec();
  }
}
