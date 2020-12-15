import { Injectable } from '@nestjs/common';

import { CreateWaybillDto } from './dto';
import { Waybill, WayBillAction, WaybillType } from './interfaces';

import { TransactionService } from './transaction.service';

@Injectable()
export class WaybillService {
  constructor(private readonly transactionService: TransactionService) {}

  async create(waybill: Waybill) {
    const { action, stock, type, transactions } = waybill;
    return waybill;
  }

  async process(waybill: CreateWaybillDto): Promise<any> {
    const { action, products, destination, source } = waybill;
    switch (action) {
      case WayBillAction.BUY:
      case WayBillAction.IMPORT: {
        console.log('Income transaction');
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
