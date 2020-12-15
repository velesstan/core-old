import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateWaybillDto } from './dto';
import {
  Waybill,
  WayBillAction,
  WaybillModel,
  WaybillType,
} from './interfaces';
import { WaybillRef } from './schemas';
import { StockService } from './stock.service';

import { TransactionService } from './transaction.service';

@Injectable()
export class WaybillService {
  constructor(
    @InjectModel(WaybillRef) private readonly waybillModel: Model<WaybillModel>,
    private readonly transactionService: TransactionService,
    private readonly stockService: StockService,
  ) {}

  async create(waybill: Waybill): Promise<WaybillModel> {
    const { action, stock, type, transactions, title } = waybill;
    return await new this.waybillModel({
      action,
      type,
      stock,
      transactions,
      title,
    }).save();
  }

  async process(waybill: CreateWaybillDto): Promise<any> {
    const { action, products, destination, source } = waybill;
    switch (action) {
      case WayBillAction.BUY:
      case WayBillAction.IMPORT: {
        console.log('Income transaction');
        const nextIncomeWaybillTitle = await this.stockService.nextWaybillIncomeNumber(
          destination,
        );
        const transactions = await Promise.all(
          products.map((p) =>
            this.transactionService.create({
              product: p.product,
              quantity: p.quantity,
              stock: destination,
            }),
          ),
        );
        const waybill = await this.create({
          title: nextIncomeWaybillTitle,
          type: WaybillType.INCOME,
          stock: destination,
          action,
          transactions,
        });
        return waybill;
      }
      case WayBillAction.SELL:
      case WayBillAction.UTILIZATION: {
        console.log('Outcome transaction');
        const nextOutcomeWaybillTitle = await this.stockService.nextWaybillOutcomeNumber(
          source,
        );
        const transactions = await Promise.all(
          products.map((p) =>
            this.transactionService.create({
              product: p.product,
              quantity: -p.quantity,
              stock: source,
            }),
          ),
        );
        const waybill = await this.create({
          title: nextOutcomeWaybillTitle,
          type: WaybillType.OUTCOME,
          stock: source,
          action,
          transactions,
        });
        return waybill;
      }
    }
  }
}
