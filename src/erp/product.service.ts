import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductRef } from './schemas';
import { ProductModel } from './interfaces';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductRef) private readonly productModel: Model<ProductModel>,
  ) {}

  async getProducts(category?: string): Promise<ProductModel[]> {
    const opts: any = {};
    if (category) {
      opts.category = category;
    }
    return await this.productModel.find(opts).populate('category').exec();
  }
  async create(product: CreateProductDto): Promise<ProductModel> {
    return await (
      await new this.productModel(product).populate('category').save()
    ).execPopulate();
  }
  async update(id: string, product: UpdateProductDto): Promise<ProductModel> {
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