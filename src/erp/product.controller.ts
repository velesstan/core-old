import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  Delete,
} from '@nestjs/common';

import { ProductModel } from './interfaces';
import { CreateProductDto, UpdateProductDto } from './dto';

import { ProductService } from './product.service';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async findAll(): Promise<ProductModel[]> {
    return await this.productService.find();
  }
  @Post('/')
  async createProduct(
    @Body() product: CreateProductDto,
  ): Promise<ProductModel> {
    return await this.productService.create(product);
  }
  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return await this.productService.updateById(id, product);
  }
  @Delete('/:id')
  async removeProduct(@Param('id') id: string) {
    return await this.productService.removeById(id);
  }
}
