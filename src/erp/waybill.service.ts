import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateWaybillDto, FindWaybillDto } from './dto';
import {
  Waybill,
  WaybillAction,
  WaybillModel,
  WaybillType,
} from './interfaces';
import { ProductService } from './product.service';
import { WaybillRef } from './schemas';
import { StockService } from './stock.service';

import { TransactionService } from './transaction.service';

@Injectable()
export class WaybillService {
  constructor(
    @InjectModel(WaybillRef) private readonly waybillModel: Model<WaybillModel>,
    private readonly transactionService: TransactionService,
    private readonly stockService: StockService,
    private readonly productService: ProductService,
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

  async findById(id: string): Promise<WaybillModel> {
    return await this.waybillModel
      .findById(id)
      .populate([
        {
          path: 'transactions',
          populate: [
            {
              path: 'product',
              populate: 'category',
            },
          ],
        },
        {
          path: 'stock',
        },
      ])
      .exec();
  }

  async find(query: FindWaybillDto): Promise<WaybillModel[]> {
    return await this.waybillModel
      .find(query)
      .sort('-createdAt')
      .populate([
        {
          path: 'transactions',
          populate: [
            {
              path: 'product',
              populate: 'category',
            },
          ],
        },
        {
          path: 'stock',
        },
      ])
      .exec();
  }

  async process(waybill: CreateWaybillDto): Promise<any> {
    const { action, products, destination, source } = waybill;
    switch (action) {
      case WaybillAction.BUY:
      case WaybillAction.IMPORT: {
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
          transactions: transactions.map((t) => t._id),
        });
        return waybill;
      }
      case WaybillAction.SELL:
      case WaybillAction.UTILIZATION: {
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
          transactions: transactions.map((t) => t._id),
        });
        return waybill;
      }
      case WaybillAction.MOVE: {
        const nextOutcomeWaybillTitle = await this.stockService.nextWaybillOutcomeNumber(
          source,
        );
        const nexIncomeWaybillTitle = await this.stockService.nextWaybillOutcomeNumber(
          destination,
        );
        const outCometransactions = await Promise.all(
          products.map((p) =>
            this.transactionService.create({
              product: p.product,
              quantity: -p.quantity,
              stock: source,
            }),
          ),
        );
        const outcomeWaybill = await this.create({
          title: nextOutcomeWaybillTitle,
          type: WaybillType.OUTCOME,
          stock: source,
          action,
          transactions: outCometransactions.map((t) => t._id),
        });

        const incometransactions = await Promise.all(
          products.map((p) =>
            this.transactionService.create({
              product: p.product,
              quantity: p.quantity,
              stock: destination,
            }),
          ),
        );
        const incomeWaybill = await this.create({
          title: nexIncomeWaybillTitle,
          type: WaybillType.INCOME,
          stock: destination,
          action,
          transactions: incometransactions.map((t) => t._id),
        });
        break;
      }
      case WaybillAction.PRODUCTION: {
        console.log('PRODUCTS: ', products);
        console.log('SOURCE: ', source);
        console.log('DEST: ', destination);
        const populatedProducts = await Promise.all(
          products.map(async (p) => {
            const product = await this.productService.getById(p.product);
            return {
              productId: product._id,
              requires: product.requires,
              quantity: p.quantity,
            };
          }),
        );

        const nextOutcomeWaybillTitle = await this.stockService.nextWaybillOutcomeNumber(
          source,
        );
        const nexIncomeWaybillTitle = await this.stockService.nextWaybillOutcomeNumber(
          destination,
        );
        const outCometransactions = [];

        for (let i = 0; i < populatedProducts.length; i++) {
          for (let j = 0; j < populatedProducts[i].requires.length; j++) {
            let transaction = await this.transactionService.create({
              product: populatedProducts[i].requires[j].product,
              quantity:
                -populatedProducts[i].requires[j].quantity *
                populatedProducts[i].quantity,
              stock: source,
            });
            outCometransactions.push(transaction);
          }
        }
        const outcomeWaybill = await this.create({
          title: nextOutcomeWaybillTitle,
          type: WaybillType.OUTCOME,
          stock: source,
          action,
          transactions: outCometransactions.map((t) => t._id),
        });

        const incometransactions = await Promise.all(
          products.map((p) =>
            this.transactionService.create({
              product: p.product,
              quantity: p.quantity,
              stock: destination,
            }),
          ),
        );
        const incomeWaybill = await this.create({
          title: nexIncomeWaybillTitle,
          type: WaybillType.INCOME,
          stock: destination,
          action,
          transactions: incometransactions.map((t) => t._id),
        });
        break;
      }
    }
  }
}
