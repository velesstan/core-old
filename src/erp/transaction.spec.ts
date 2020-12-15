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
} from './schemas';
import { TransactionService } from './transaction.service';
import { ProductService } from './product.service';
import { StockService } from './stock.service';
import { CategoryService } from './category.service';
import { CategoryModel, ProductModel, StockModel } from './interfaces';

let mongod: MongoMemoryServer;

describe('Transaction service', () => {
  let module: TestingModule;
  let transactionService: TransactionService;
  let categoryService: CategoryService;
  let productService: ProductService;
  let stockService: StockService;

  let product: ProductModel;
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
        ]),
      ],
      providers: [
        TransactionService,
        CategoryService,
        ProductService,
        StockService,
      ],
    }).compile();
    transactionService = module.get(TransactionService);
    categoryService = module.get(CategoryService);
    productService = module.get(ProductService);
    stockService = module.get(StockService);

    category = await categoryService.create({
      title: 'TestCategory',
      unit: 'unit',
    });
    product = await productService.create({
      category: category._id,
      title: 'TestProduct',
      code: 'test-1',
      price: 100,
    });
    stock = await stockService.create({
      title: 'Stock',
      waybillPrefix: 'S',
    });
  });

  it('service should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('should create transaction', async () => {
    const $transaction = await transactionService.create({
      product: product._id,
      quantity: 1,
      stock: stock._id,
    });
    expect($transaction).toMatchObject({
      product: product._id,
      quantity: 1,
      stock: stock._id,
    });
    expect($transaction.createdAt).toBeDefined();
  });
});
