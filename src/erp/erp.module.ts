import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CategoryRef,
  CategorySchema,
  StockRef,
  StockSchema,
  ProductRef,
  ProductSchema,
  TransactionRef,
  TransactionSchema,
  WaybillRef,
  WaybillSchema,
} from './schemas';

import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';
import { WaybillController } from './waybill.controller';
import { WaybillService } from './waybill.service';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryRef, schema: CategorySchema },
      { name: StockRef, schema: StockSchema },
      { name: ProductRef, schema: ProductSchema },
      { name: TransactionRef, schema: TransactionSchema },
      { name: WaybillRef, schema: WaybillSchema },
    ]),
  ],
  controllers: [
    StockController,
    ProductController,
    CategoryController,
    WaybillController,
  ],
  providers: [
    ProductService,
    CategoryService,
    StockService,
    WaybillService,
    TransactionService,
  ],
})
export class ERPModule {}
