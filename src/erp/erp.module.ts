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
} from './schemas';

import { ERPController } from './erp.controller';
import { TransactionService } from './transaction.service';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { StockService } from './stock.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryRef, schema: CategorySchema },
      { name: StockRef, schema: StockSchema },
      { name: ProductRef, schema: ProductSchema },
      { name: TransactionRef, schema: TransactionSchema },
    ]),
  ],
  controllers: [ERPController],
  providers: [
    TransactionService,
    ProductService,
    CategoryService,
    StockService,
  ],
})
export class ERPModule {}
