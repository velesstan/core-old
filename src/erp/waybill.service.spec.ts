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
import { CategoryModel, ProductModel, StockModel } from './interfaces';

let mongod: MongoMemoryServer;

describe('Waybill service', () => {
  let module: TestingModule;
  let transactionService: TransactionService;
  let waybillService: WaybillService;
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
    expect(waybillService).toBeDefined();
  });
});
