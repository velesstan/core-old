import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import {
  CategoryRef,
  CategorySchema,
  ProductRef,
  ProductSchema,
  StockRef,
  StockSchema,
  TransactionRef,
  TransactionSchema,
  WaybillRef,
  WaybillSchema,
} from './schemas';
import { TransactionService } from './transaction.service';
import { ProductService } from './product.service';
import { StockService } from './stock.service';
import { CategoryService } from './category.service';
import { WaybillService } from './waybill.service';
import {
  CategoryModel,
  StockModel,
  WayBillAction,
  WaybillType,
} from './interfaces';

let mongod: MongoMemoryServer;

describe('Waybill service', () => {
  let module: TestingModule;
  let transactionService: TransactionService;
  let waybillService: WaybillService;
  let categoryService: CategoryService;
  let productService: ProductService;
  let stockService: StockService;

  let category: CategoryModel;
  let stock: StockModel;

  afterEach(async () => {
    await module.close();
    await mongod.stop();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: TransactionRef, schema: TransactionSchema },
          { name: CategoryRef, schema: CategorySchema },
          { name: ProductRef, schema: ProductSchema },
          { name: StockRef, schema: StockSchema },
          { name: WaybillRef, schema: WaybillSchema },
        ]),
      ],
      providers: [
        TransactionService,
        CategoryService,
        ProductService,
        StockService,
        WaybillService,
      ],
    }).compile();
    transactionService = module.get(TransactionService);
    categoryService = module.get(CategoryService);
    productService = module.get(ProductService);
    stockService = module.get(StockService);
    waybillService = module.get(WaybillService);

    category = await categoryService.create({
      title: 'TestCategory',
      unit: 'unit',
    });
    stock = await stockService.create({
      title: 'Stock',
      waybillPrefix: 'S',
    });
  });

  it('service should be defined', () => {
    expect(waybillService).toBeDefined();
  });

  it('should create waybill', async () => {
    const product_1 = await productService.create({
      category: category._id,
      title: 'T-1',
      code: 't-1',
      price_retail: 100,
      price_wholesale: 90,
    });
    const product_2 = await productService.create({
      category: category._id,
      title: 'T-2',
      code: 't-2',
      price_retail: 200,
      price_wholesale: 190,
    });
    const transactions = await Promise.all(
      [product_1, product_2].map((p) =>
        transactionService.create({
          product: p._id,
          quantity: 1,
          stock: stock._id,
        }),
      ),
    );
    const waybill = await waybillService.create({
      action: WayBillAction.IMPORT,
      type: WaybillType.INCOME,
      stock: stock._id,
      title: 'WB-1',
      transactions: transactions.map((t) => t._id),
    });
    expect(waybill.toObject()).toMatchObject({
      title: 'WB-1',
      type: 'INCOME',
      action: 'IMPORT',
      stock: stock._id,
      transactions: [transactions[0]._id, transactions[1]._id],
    });
  });

  it('should find and populate waybills', async () => {
    const product_1 = await productService.create({
      category: category._id,
      title: 'T-1',
      code: 't-1',
      price_retail: 100,
      price_wholesale: 90,
    });
    const product_2 = await productService.create({
      category: category._id,
      title: 'T-2',
      code: 't-2',
      price_retail: 200,
      price_wholesale: 190,
    });
    const products = [product_1, product_2];
    const transactions = await Promise.all(
      products.map((p) =>
        transactionService.create({
          product: p._id,
          quantity: 1,
          stock: stock._id,
        }),
      ),
    );
    await waybillService.create({
      action: WayBillAction.IMPORT,
      type: WaybillType.INCOME,
      stock: stock._id,
      title: 'WB-1',
      transactions: transactions.map((t) => t._id),
    });
    const waybills = await waybillService.find({});
    expect(waybills).toHaveLength(1);
    expect(waybills[0].toObject().transactions).toHaveLength(2);
    waybills[0].toObject().transactions.map((t, index) => {
      expect(t).toMatchObject({
        product: {
          _id: products[index]._id,
          code: products[index].code,
          category: {
            _id: category._id,
            title: category.title,
          },
        },
        quantity: 1,
        stock: stock._id,
      });
    });
  });

  it('should process income waybill', async () => {
    const product_1 = await productService.create({
      category: category._id,
      title: 'T-1',
      code: 't-1',
      price_retail: 100,
      price_wholesale: 90,
    });
    const product_2 = await productService.create({
      category: category._id,
      title: 'T-2',
      code: 't-2',
      price_retail: 200,
      price_wholesale: 190,
    });
    const waybill = await waybillService.process({
      action: WayBillAction.BUY,
      destination: stock._id,
      products: [
        { product: product_1._id, quantity: 1 },
        { product: product_2._id, quantity: 2 },
      ],
    });
    expect(waybill).toMatchObject({
      action: 'BUY',
      type: 'INCOME',
      title: 'S-1',
      stock: stock._id,
    });
    expect(waybill.transactions).toHaveLength(2);
  });

  it('should process outcome waybill', async () => {
    const product_1 = await productService.create({
      category: category._id,
      title: 'T-1',
      code: 't-1',
      price_retail: 100,
      price_wholesale: 90,
    });
    const product_2 = await productService.create({
      category: category._id,
      title: 'T-2',
      code: 't-2',
      price_retail: 200,
      price_wholesale: 190,
    });
    const waybill = await waybillService.process({
      action: WayBillAction.SELL,
      source: stock._id,
      products: [
        { product: product_1._id, quantity: 1 },
        { product: product_2._id, quantity: 2 },
      ],
    });
    expect(waybill).toMatchObject({
      action: 'SELL',
      type: 'OUTCOME',
      title: 'S-1',
      stock: stock._id,
    });
    expect(waybill.transactions).toHaveLength(2);
  });
});
