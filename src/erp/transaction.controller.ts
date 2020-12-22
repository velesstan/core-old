import { Controller, Get, Query } from '@nestjs/common';

import { FindTransactionsDto } from './dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/residue')
  async count(@Query() query: FindTransactionsDto) {
    return await this.transactionService.count(query);
  }
}
