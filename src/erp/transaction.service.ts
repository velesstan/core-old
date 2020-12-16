import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Transaction, TransactionModel } from './interfaces';
import { TransactionRef } from './schemas';

type ResidueParams = {
  readonly stock: string;
  readonly start: Date;
  readonly end: Date;
};

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
  ) {}

  async create(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }

  async count(params: ResidueParams) {
    const { stock, start, end } = params;
    const aggregated = await this.transactionModel.aggregate([
      {
        $match: {
          stock: new ObjectId(stock),
          createdAt: {
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: '$product',
          startBalance: {
            $sum: {
              $cond: [{ $lte: ['$createdAt', start] }, '$quantity', 0],
            },
          },
          endBalance: {
            $sum: '$quantity',
          },
          totalIncome: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', start] },
                    { $gt: ['$quantity', 0] },
                  ],
                },
                '$quantity',
                0,
              ],
            },
          },
          totalOutcome: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', start] },
                    { $lt: ['$quantity', 0] },
                  ],
                },
                '$quantity',
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
    ]);
    // console.log(aggregated);
    return aggregated;
  }
}
