// import { Test, TestingModule } from '@nestjs/testing';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';

// import { ERPService } from './erp.service';
// import { TransactionService } from './transaction.service';

// import {
//   CategoryRef,
//   CategorySchema,
//   ProductRef,
//   ProductSchema,
//   StockRef,
//   StockSchema,
//   TransactionRef,
//   TransactionSchema,
// } from './schemas';
// import {
//   CategoryModel,
//   ProductModel,
//   StockModel,
//   WaybillAction,
//   WaybillType,
// } from './interfaces';
// import { ProductService } from './product.service';
// import { StockService } from './stock.service';
// import { CategoryService } from './category.service';

// let mongod: MongoMemoryServer;

// describe('Transaction service', () => {
//   let module: TestingModule;
//   let productService: ProductService;
//   let stockService: StockService;
//   let categoryService: CategoryService;
//   let transactionService: TransactionService;

//   let category: CategoryModel;
//   let product: ProductModel;
//   let stockA: StockModel;
//   let stockB: StockModel;

//   afterEach(async () => {
//     await module.close();
//     await mongod.stop();
//     await mongoose.disconnect();
//   });

//   beforeEach(async () => {
//     mongod = new MongoMemoryServer();
//     module = await Test.createTestingModule({
//       imports: [
//         MongooseModule.forRootAsync({
//           useFactory: async () => ({
//             uri: await mongod.getUri(),
//             useFindAndModify: false,
//             useUnifiedTopology: true,
//             useNewUrlParser: true,
//             useCreateIndex: true,
//           }),
//         }),
//         MongooseModule.forFeature([
//           { name: CategoryRef, schema: CategorySchema },
//           { name: ProductRef, schema: ProductSchema },
//           { name: StockRef, schema: StockSchema },
//           { name: TransactionRef, schema: TransactionSchema },
//         ]),
//       ],
//       providers: [
//         TransactionService,
//         StockService,
//         ProductService,
//         CategoryService,
//       ],
//     }).compile();
//     productService = module.get(ProductService);
//     categoryService = module.get(CategoryService);
//     stockService = module.get(StockService);
//     transactionService = module.get(TransactionService);
//   });

//   describe('Making transactions', () => {});

//   it('service should be defined', () => {
//     expect(transactionService).toBeDefined();
//   });

//   it('should create transaction properly', async () => {
//     const stock = await erpService.createStock({
//       title: 'Склад',
//       waybillPrefix: 'С',
//     });
//     const category = await erpService.createCategory({
//       title: 'Памятник',
//       unit: 'ед.',
//     });
//     const product = await erpService.createProduct({
//       category: category._id,
//       code: 'Памятник-1',
//       title: 'gravestone',
//       price: 200,
//     });
//     const date = new Date();
//     const transaction = await transactionService.WriteTransaction({
//       stock: stock._id,
//       quantity: 7,
//       product: product._id,
//       waybill: {
//         action: WaybillAction.BUY,
//         type: WaybillType.INCOME,
//         date: date,
//         id: 'some-id',
//       },
//       snapshot: {
//         discount: 0,
//         reduce: false,
//         price: 20,
//       },
//     });
//     expect(transaction.snapshot.price).toBe(20);
//     expect(transaction.waybill.type).toBe('INCOME');
//     expect(transaction.waybill.action).toBe('BUY');
//     expect(transaction.waybill.id).toBe('some-id');
//     expect(transaction.waybill.date).toBe(date);
//     expect(transaction.quantity).toBe(7);
//     expect(transaction.stock).toBe(stock._id);
//     expect(transaction.product).toBe(product._id);
//   });
// });
