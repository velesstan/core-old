import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StockRef } from './schemas';
import { StockModel } from './interfaces';
import { CreateStockDto, UpdateStockDto } from './dto';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(StockRef) private readonly stockModel: Model<StockModel>,
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {}
  async getById(id: string): Promise<StockModel> {
    return await this.stockModel.findById(id).exec();
  }
  async find(): Promise<StockModel[]> {
    return await this.stockModel.find({}).exec();
  }
  async create(stock: CreateStockDto): Promise<StockModel> {
    return await new this.stockModel(stock).save();
  }
  async updateById(id: string, stock: UpdateStockDto): Promise<StockModel> {
    return await this.stockModel
      .findByIdAndUpdate(id, stock, { new: true })
      .exec();
  }
  async removeById(id: string) {
    return await this.stockModel.findByIdAndRemove(id).exec();
  }
}
