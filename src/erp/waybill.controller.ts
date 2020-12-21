import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';

import { DocumentService } from '../document';

import { CreateWaybillDto, FindWaybillDto } from './dto';
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

  @Get('/print/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment;')
  async printWaybill(@Param('id') id: string, @Res() response: Response) {
    const waybill = await this.waybillService.findById(id);
    Readable.from(await this.documentService.makeInvoice(waybill)).pipe(
      response,
    );
  }
}
