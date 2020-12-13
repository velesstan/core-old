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
  ) {}

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
  async stockNextIncomeWaybill(id: string): Promise<string> {
    const { waybillPrefix, incomeWaybillCount } = await this.stockModel
      .findByIdAndUpdate(id, {
        $inc: { incomeWaybillCount: 1 },
      })
      .exec();
    return `${waybillPrefix}-${incomeWaybillCount + 1}`;
  }
  async stockNextOutcomeWaybill(id: string): Promise<string> {
    const { waybillPrefix, outcomeWaybillCount } = await this.stockModel
      .findByIdAndUpdate(id, {
        $inc: { outcomeWaybillCount: 1 },
      })
      .exec();
    return `${waybillPrefix}-${outcomeWaybillCount + 1}`;
  }
}
