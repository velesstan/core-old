import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { TransactionRef } from './schemas';
import {
  TransactionModel,
  Transaction,
  ResidueOpts,
  WaybillAction,
  WaybillType,
  WaybillItem,
} from './interfaces';
import { CreateWaybillDto } from './dto';

import { ERPService } from './erp.service';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { StockService } from './stock.service';

type BulkData = {
  stock: string;
  waybill: {
    action: WaybillAction;
    type: WaybillType;
    date: Date;
    id: string;
  };
  items: WaybillItem[];
};
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly stockService: StockService,
  ) {}

  async WriteBulkTransactions(data: BulkData): Promise<void> {
    const { stock, items, waybill } = data;
    console.log(data);
    await Promise.all(
      items.map((item) =>
        this.WriteTransaction({
          stock: stock,
          product: item.product,
          quantity: item.quantity,
          snapshot: item.snapshot,
          waybill: waybill,
        }),
      ),
    );
  }

  async WriteTransaction(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }

  async CreateWaybill(waybill: CreateWaybillDto) {
    const { action, source, destination, products } = waybill;
    // const date = moment.utc().toDate();
    switch (action) {
      case WaybillAction.BUY:
      case WaybillAction.IMPORT: {
        const incomeWB = await this.stockService.stockNextIncomeWaybill(
          waybill.destination,
        );
        await this.WriteBulkTransactions({
          stock: destination,
          items: products,
          waybill: {
            type: WaybillType.INCOME,
            action: action,
            date: new Date(),
            id: incomeWB,
          },
        });
        break;
      }
      case WaybillAction.SELL:
      case WaybillAction.UTILIZATION: {
        const outcomeWB = await this.stockService.stockNextOutcomeWaybill(
          waybill.source,
        );
        await this.WriteBulkTransactions({
          stock: source,
          items: products,
          waybill: {
            type: WaybillType.OUTCOME,
            action: action,
            date: new Date(),
            id: outcomeWB,
          },
        });
        break;
      }
      case WaybillAction.MOVE: {
        const incomeWB = await this.stockService.stockNextIncomeWaybill(
          waybill.destination,
        );
        const outcomeWB = await this.stockService.stockNextOutcomeWaybill(
          waybill.source,
        );
        await this.WriteBulkTransactions({
          stock: destination,
          items: products,
          waybill: {
            type: WaybillType.INCOME,
            action: action,
            date: new Date(),
            id: incomeWB,
          },
        });
        await this.WriteBulkTransactions({
          stock: source,
          items: products,
          waybill: {
            type: WaybillType.OUTCOME,
            action: action,
            date: new Date(),
            id: outcomeWB,
          },
        });
        break;
      }
    }
  }

  async CalculateResidue(residueOpts: ResidueOpts): Promise<any> {
    const { stock, startDate, endDate } = residueOpts;

    let matchingOpts: Array<any> = [];
    if (stock !== undefined) {
      matchingOpts.push({
        $match: {
          stock: Types.ObjectId(stock),
        },
      });
    }

    const aggregated = await this.transactionModel
      .aggregate([
        ...matchingOpts,
        {
          $match: {
            createdAt: {
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$product',
            endBalance: {
              $sum: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$waybill.type', 'INCOME'] },
                      then: '$quantity',
                    },
                    {
                      case: { $eq: ['$waybill.type', 'OUTCOME'] },
                      then: { $multiply: [-1, '$quantity'] },
                    },
                  ],
                },
              },
            },
            startBalance: {
              $sum: {
                $cond: [
                  { $lte: ['$createdAt', startDate] },
                  {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ['$waybill.type', 'INCOME'] },
                          then: '$quantity',
                        },
                        {
                          case: { $eq: ['$waybill.type', 'OUTCOME'] },
                          then: { $multiply: [-1, '$quantity'] },
                        },
                      ],
                    },
                  },
                  0,
                ],
              },
            },
            income: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startDate] },
                      { $eq: ['$waybill.type', 'INCOME'] },
                    ],
                  },
                  '$quantity',
                  0,
                ],
              },
            },
            outcome: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startDate] },
                      { $eq: ['$waybill.type', 'OUTCOME'] },
                    ],
                  },
                  { $multiply: [-1, '$quantity'] },
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'productrefs',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $lookup: {
            from: 'categoryrefs',
            localField: 'product.category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $sort: { 'product.title': 1 },
        },
      ])
      .exec();
    return aggregated;
  }

  async GetWaybills() {
    return await this.transactionModel
      .aggregate([
        {
          $lookup: {
            from: 'stockrefs',
            localField: 'stock',
            foreignField: '_id',
            as: 'stock',
          },
        },
        {
          $unwind: '$stock',
        },
        {
          $lookup: {
            from: 'productrefs',
            localField: 'product',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $lookup: {
            from: 'categoryrefs',
            localField: 'product.category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $group: {
            _id: {
              stock: '$stock',
              waybill: '$waybill.id',
              action: '$waybill.action',
              type: '$waybill.type',
            },
            items: {
              $push: {
                product: '$product.title',
                category: '$category.title',
                quantity: '$quantity',
                price: '$snapshot.price',
              },
            },
          },
        },
      ])
      .exec();
  }
}
