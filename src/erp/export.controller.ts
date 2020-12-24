import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';

import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('/categories')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment;')
  async exportCategories(@Res() response: Response) {
    try {
      Readable.from(await this.exportService.exportProducts()).pipe(response);
    } catch (e) {
      throw new HttpException(
        'Error creating generating invoice PDF.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
