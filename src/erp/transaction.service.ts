import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction, TransactionModel } from './interfaces';
import { TransactionRef } from './schemas';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
  ) {}

  async create(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }
}
