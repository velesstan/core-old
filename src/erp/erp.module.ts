import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CategoryRef,
  CategorySchema,
  StockRef,
  StockSchema,
  ProductRef,
  ProductSchema,
} from './schemas';

import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryRef, schema: CategorySchema },
      { name: StockRef, schema: StockSchema },
      { name: ProductRef, schema: ProductSchema },
    ]),
  ],
  controllers: [StockController, ProductController, CategoryController],
  providers: [ProductService, CategoryService, StockService],
})
export class ERPModule {}
