import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import moment from 'dayjs';

import { CategoryModel, ProductModel, StockModel } from './interfaces';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  CreateStockDto,
  UpdateStockDto,
  CreateWaybillDto,
} from './dto';
import { TransactionService } from './transaction.service';
import { CategoryService } from './category.service';
import { StockService } from './stock.service';
import { ProductService } from './product.service';

@Controller('/erp')
export class ERPController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly stockService: StockService,
    private readonly productService: ProductService,
    private readonly transactionService: TransactionService,
  ) {}

  // Cateories
  @Get('/categories')
  async find(): Promise<CategoryModel[]> {
    return await this.categoryService.find();
  }
  @Post('/categories')
  async createCategory(
    @Body() category: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.categoryService.create(category);
  }
  @Put('/categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateById(id, category);
  }
  @Delete('/categories/:id')
  async removeCategory(@Param('id') id: string) {
    return await this.categoryService.removeById(id);
  }

  // Products
  @Get('/products')
  async findAll(): Promise<ProductModel[]> {
    return await this.productService.find();
  }
  @Post('/products')
  async createProduct(
    @Body() product: CreateProductDto,
  ): Promise<ProductModel> {
    return await this.productService.create(product);
  }
  @Put('/products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return await this.productService.updateById(id, product);
  }
  @Delete('/products/:id')
  async removeProduct(@Param('id') id: string) {
    return await this.productService.removeById(id);
  }

  // Stocks
  @Get('/stocks')
  async getStocks(): Promise<StockModel[]> {
    return await this.stockService.find();
  }
  @Post('/stocks')
  async createStock(@Body() stock: CreateStockDto): Promise<StockModel> {
    return await this.stockService.create(stock);
  }
  @Put('/stocks/:id')
  async updateStock(
    @Param('id') id: string,
    @Body() stock: UpdateStockDto,
  ): Promise<StockModel> {
    return await this.stockService.updateById(id, stock);
  }
  @Delete('/stocks/:id')
  async removeStock(@Param('id') id: string) {
    return await this.stockService.removeById(id);
  }

  @Post('/waybill')
  async createWaybill(@Body() waybill: CreateWaybillDto) {
    await this.transactionService.CreateWaybill(waybill);
  }

  @Get('/waybills')
  async getWaybills(): Promise<any> {
    return await this.transactionService.GetWaybills();
  }

  @Get('/residue')
  async calculateResidue(
    @Query('startDate') start: Date,
    @Query('endDate') end: Date,
    @Query('stock') stock: string,
  ) {
    return await this.transactionService.CalculateResidue(
      stock,
      moment(start).startOf('day').toDate(),
      moment(end).endOf('day').toDate(),
    );
  }
}
