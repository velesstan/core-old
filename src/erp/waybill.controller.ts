import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateWaybillDto } from './dto/waybill.dto';

import { WaybillService } from './waybill.service';

@Controller('waybills')
export class WaybillController {
  constructor(private readonly waybillService: WaybillService) {}

  @Get('/')
  async getWaybills() {
    return await this.waybillService.find();
  }

  @Post('/')
  async postWaybill(@Body() waybill: CreateWaybillDto) {
    const newWaybill = await this.waybillService.process(waybill);
    console.log('========NEW WAYBILL========');
    console.log(newWaybill);
    return newWaybill;
  }
}
