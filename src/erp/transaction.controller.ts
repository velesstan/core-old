import { Controller, Get, Query } from '@nestjs/common';

import dayjs from 'dayjs';

import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/residue')
  async count(
    @Query('stock') stock: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.transactionService.count({
      stock,
      start: dayjs.utc(start).startOf('day').toDate(),
      end: dayjs.utc(end).endOf('day').toDate(),
    });
  }
}
