import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryRef } from './schemas';
import { CategoryModel } from './interfaces';
import { UpdateCategoryDto, CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryRef)
    private readonly categoryModel: Model<CategoryModel>,
  ) {
    this.fixUnit();
  }

  async fixUnit() {
    const res = await this.categoryModel
      .updateMany({}, { $unset: { unit: true } }, { multi: true })
      .exec();
  }

  async find(): Promise<CategoryModel[]> {
    return await this.categoryModel.find({}).exec();
  }

  async getById(id: string): Promise<CategoryModel | null> {
    return await this.categoryModel.findById(id).exec();
  }

  async create(category: CreateCategoryDto): Promise<CategoryModel> {
    return await new this.categoryModel(category).save();
  }
  async updateById(
    id: string,
    category: UpdateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.categoryModel
      .findByIdAndUpdate(id, category, {
        new: true,
      })
      .exec();
  }
  async removeById(id: string) {
    return await this.categoryModel.findByIdAndDelete(id).exec();
    // TODO remove products & transactions
  }
}
