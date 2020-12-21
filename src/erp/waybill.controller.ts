import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateWaybillDto, FindWaybillDto } from './dto';

import { DocumentService } from '../document';
import { WaybillService } from './waybill.service';

@Controller('waybills')
export class WaybillController {
  constructor(
    private readonly waybillService: WaybillService,
    private readonly documentService: DocumentService,
  ) {}

  @Get('/')
  async find(@Query() query: FindWaybillDto) {
    return await this.waybillService.find(query);
  }

  @Post('/')
  async postWaybill(@Body() waybill: CreateWaybillDto) {
    const newWaybill = await this.waybillService.process(waybill);
    console.log('========NEW WAYBILL========');
    console.log(newWaybill);
    return newWaybill;
  }

  @Post('/print/:id')
  async printWaybill(@Param('id') id: string) {
    console.log('ID: ', id);
    const waybill = await this.waybillService.find({ _id: id });
    await this.documentService.makeInvoice();
    return waybill;
  }
}
