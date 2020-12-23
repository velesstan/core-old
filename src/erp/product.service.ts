import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductRef } from './schemas';
import { Product, ProductModel } from './interfaces';
import { FindProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductRef) private readonly productModel: Model<ProductModel>,
  ) {
    this.renameField();
  }

  async renameField() {
    await this.productModel
      .update({}, { $rename: { price: 'price_retail' } }, { multi: true })
      .exec();
  }

  async find(query: FindProductDto): Promise<ProductModel[]> {
    return await this.productModel.find(query).populate('category').exec();
  }

  async getById(id: string): Promise<ProductModel | null> {
    return await this.productModel.findById(id).exec();
  }

  async create(product: Product): Promise<ProductModel> {
    return await (
      await new this.productModel(product).populate('category').save()
    ).execPopulate();
  }
  async updateById(id: string, product: Product): Promise<ProductModel> {
    return await this.productModel
      .findByIdAndUpdate(id, product, {
        new: true,
      })
      .populate('category')
      .exec();
  }
  async removeById(id: string) {
    return await this.productModel.findByIdAndRemove(id).exec();
    // TODO remove transactions
  }
}
