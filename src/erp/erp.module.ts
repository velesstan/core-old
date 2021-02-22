import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentModule, DocumentService } from '../document';

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
  WaybillCounterRef,
  WaybillCounterSchema,
} from './schemas';

import { NotificationModule } from '../notification';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { WaybillService } from './waybill.service';
import { TransactionService } from './transaction.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';
import { WaybillController } from './waybill.controller';
import { TransactionController } from './transaction.controller';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryRef, schema: CategorySchema },
      { name: StockRef, schema: StockSchema },
      { name: ProductRef, schema: ProductSchema },
      { name: TransactionRef, schema: TransactionSchema },
      { name: WaybillRef, schema: WaybillSchema },
      { name: WaybillCounterRef, schema: WaybillCounterSchema },
    ]),
    DocumentModule,
    NotificationModule,
  ],
  controllers: [
    StockController,
    ProductController,
    CategoryController,
    WaybillController,
    TransactionController,
    ExportController,
  ],
  providers: [
    ProductService,
    CategoryService,
    StockService,
    WaybillService,
    TransactionService,
    DocumentService,
    ExportService,
  ],
})
export class ERPModule {}
