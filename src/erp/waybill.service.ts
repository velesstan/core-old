import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelegramService } from 'src/notification';

import { CreateWaybillDto, FindWaybillDto } from './dto';
import {
  Waybill,
  WaybillAction,
  WaybillCounterModel,
  WaybillModel,
  WaybillType,
} from './interfaces';
import { ProductService } from './product.service';
import { WaybillCounterRef, WaybillRef } from './schemas';

import { TransactionService } from './transaction.service';

@Injectable()
export class WaybillService {
  constructor(
    @InjectModel(WaybillRef) private readonly waybillModel: Model<WaybillModel>,
    @InjectModel(WaybillCounterRef)
    private readonly waybillCounterModel: Model<WaybillCounterModel>,
    private readonly transactionService: TransactionService,
    private readonly productService: ProductService,
    private readonly telegramService: TelegramService,
  ) {
    this.initialize();
  }

  async create(waybill: Waybill): Promise<WaybillModel> {
    const { action, stock, type, transactions, serialNumber, user } = waybill;

    const $waybill = await new this.waybillModel({
      action,
      type,
      stock,
      transactions,
      serialNumber,
      user,
    }).save();
    await $waybill
      .populate([{ path: 'user' }, { path: 'stock' }])
      .execPopulate();

    await this.telegramService.sendMessage(
      `Новая накладная\nНомер: *${serialNumber}*\nТип: *${
        type == WaybillType.INCOME ? 'Приход' : 'Расход'
      }*\nКуда: *${($waybill.stock as any).title}*\nПользователь: *${
        ($waybill.user as any).lastName
      } ${($waybill.user as any).firstName}*`,
    );
    return $waybill;
  }

  private async initialize(): Promise<void> {
    const waybillCounter = await this.waybillCounterModel.find({}).exec();
    if (waybillCounter.length === 1) {
      return;
    }
    if (waybillCounter.length === 0) {
      await new this.waybillCounterModel({ serialNumber: 0 }).save();
    } else {
      throw 'Error waybill serial number!';
    }
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
    const { start, end, stock, ...rest } = query;
    return await this.waybillModel
      .find({
        ...rest,
        ...(stock ? { stock } : {}),
        ...(end
          ? {
              createdAt: {
                $gte: start,
                $lte: end,
              },
            }
          : {}),
      })
      .sort('-createdAt')
      .limit(10)
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
        {
          path: 'user',
        },
      ])
      .exec();
  }

  async nextWaybillSerialNumber(): Promise<number> {
    const { serialNumber } = await this.waybillCounterModel
      .findOneAndUpdate(
        {},
        {
          $inc: {
            serialNumber: 1,
          },
        },
        { new: true },
      )
      .exec();
    return serialNumber;
  }

  async process(waybill: CreateWaybillDto, user: string): Promise<any> {
    const { action, products, destination, source } = waybill;
    switch (action) {
      case WaybillAction.BUY:
      case WaybillAction.IMPORT: {
        const serialNumber = await this.nextWaybillSerialNumber();
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
          serialNumber: serialNumber,
          type: WaybillType.INCOME,
          stock: destination,
          action,
          transactions: transactions.map((t) => t._id),
          user,
        });
        return waybill;
      }
      case WaybillAction.SELL:
      case WaybillAction.UTILIZATION: {
        const serialNumber = await this.nextWaybillSerialNumber();
        const transactions = await Promise.all(
          products.map((p) =>
            this.transactionService.create({
              product: p.product,
              quantity: -p.quantity,
              ...(action === WaybillAction.SELL
                ? { snapshot: p.snapshot }
                : {}),
              stock: source,
            }),
          ),
        );
        const waybill = await this.create({
          serialNumber: serialNumber,
          type: WaybillType.OUTCOME,
          stock: source,
          action,
          transactions: transactions.map((t) => t._id),
          user,
        });
        return waybill;
      }
      case WaybillAction.MOVE: {
        const serialNumber = await this.nextWaybillSerialNumber();
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
          serialNumber: serialNumber,
          type: WaybillType.OUTCOME,
          stock: source,
          action,
          transactions: outCometransactions.map((t) => t._id),
          user,
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
          serialNumber: serialNumber,
          type: WaybillType.INCOME,
          stock: destination,
          action,
          transactions: incometransactions.map((t) => t._id),
          user,
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

        const serialNumber = await this.nextWaybillSerialNumber();
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
        if (outCometransactions.length) {
          const outcomeWaybill = await this.create({
            serialNumber: serialNumber,
            type: WaybillType.OUTCOME,
            stock: source,
            action,
            transactions: outCometransactions.map((t) => t._id),
            user,
          });
        }

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
          serialNumber: serialNumber,
          type: WaybillType.INCOME,
          stock: destination,
          action,
          transactions: incometransactions.map((t) => t._id),
          user,
        });
        break;
      }
    }
  }

  async disable(waybillId: string): Promise<void> {
    const waybill = await this.waybillModel
      .findByIdAndUpdate(waybillId, {
        active: false,
      })
      .exec();
    await Promise.all(
      waybill.transactions.map((t) => this.transactionService.disable(t._id)),
    );
  }

  async enable(waybillId: string): Promise<void> {
    const waybill = await this.waybillModel
      .findByIdAndUpdate(waybillId, {
        active: true,
      })
      .exec();
    await Promise.all(
      waybill.transactions.map((t) => this.transactionService.enable(t._id)),
    );
  }

  async deleteWaybill(waybillId: string): Promise<void> {
    const waybill = await this.waybillModel.findByIdAndRemove(waybillId).exec();
    await Promise.all(
      waybill.transactions.map((t) => this.transactionService.delete(t._id)),
    );
  }
}
