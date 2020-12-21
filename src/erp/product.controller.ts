import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';

import { ProductModel } from './interfaces';
import { CreateProductDto, FindProductDto, UpdateProductDto } from './dto';

import { ProductService } from './product.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('products')
@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async find(@Query() query: FindProductDto): Promise<ProductModel[]> {
    return await this.productService.find(query);
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
