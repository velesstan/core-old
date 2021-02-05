import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
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
    return newWaybill;
  }

  @Get('/print/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment;')
  async printWaybill(@Param('id') id: string, @Res() response: Response) {
    try {
      const waybill = await this.waybillService.findById(id);
      Readable.from(await this.documentService.makeInvoice(waybill)).pipe(
        response,
      );
    } catch (e) {
      throw new HttpException(
        'Error creating generating invoice PDF.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/:id/disable')
  async disableWaybill(@Param('id') id: string) {
    await this.waybillService.disable(id);
  }

  @Post('/:id/enable')
  async enableWaybill(@Param('id') id: string) {
    await this.waybillService.enable(id);
  }

  @Delete('/:id')
  async deleyeWaybill(@Param('id') id: string) {
    await this.waybillService.deleteWaybill(id);
  }
}
