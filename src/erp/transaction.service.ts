import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Transaction, TransactionModel } from './interfaces';
import { TransactionRef } from './schemas';
import { FindTransactionsDto } from './dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
  ) {}

  async create(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }

  async delete(transactionId: string): Promise<void> {
    await this.transactionModel.findByIdAndDelete(transactionId).exec();
  }

  async disable(transactionId: string): Promise<TransactionModel> {
    return await this.transactionModel.findByIdAndUpdate(transactionId, {
      active: false,
    });
  }

  async enable(transactionId: string): Promise<TransactionModel> {
    return await this.transactionModel.findByIdAndUpdate(transactionId, {
      active: true,
    });
  }

  async count(query: FindTransactionsDto) {
    const { stock, start, end, code } = query;
    const aggregated = await this.transactionModel.aggregate([
      {
        $match: {
          active: true,
          ...(stock ? { stock: new ObjectId(stock) } : {}),
          ...(end
            ? {
                createdAt: {
                  $lte: end,
                },
              }
            : {}),
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
                    ...(start ? [{ $gte: ['$createdAt', start] }] : []),
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
                    ...(start ? [{ $gte: ['$createdAt', start] }] : []),
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
        $match: {
          ...(code ? { 'product.code': new RegExp(code.trim(), 'ig') } : {}),
        },
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
        $sort: { 'category.sortPriority': 1, 'product.code': 1 },
      },
    ]);
    return aggregated;
  }
}
