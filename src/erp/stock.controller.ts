import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';

import { StockModel } from './interfaces';
import { CreateStockDto, UpdateStockDto } from './dto';
import { StockService } from './stock.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('stocks')
@Controller('/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/')
  async getStocks(): Promise<StockModel[]> {
    return await this.stockService.find();
  }
  @Post('/')
  async createStock(@Body() stock: CreateStockDto): Promise<StockModel> {
    return await this.stockService.create(stock);
  }
  @Put('/:id')
  async updateStock(
    @Param('id') id: string,
    @Body() stock: UpdateStockDto,
  ): Promise<StockModel> {
    return await this.stockService.updateById(id, stock);
  }
  @Delete('/:id')
  async removeStock(@Param('id') id: string) {
    return await this.stockService.removeById(id);
  }
}
