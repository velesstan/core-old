import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';
import { FindTransactionsDto } from './dto';

import { ExportService } from './export.service';
import { TransactionService } from './transaction.service';

@Controller('export')
export class ExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly transactionService: TransactionService,
  ) {}

  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment;')
  @Get('/categories')
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

  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment;')
  @Get('/residue')
  async printResidues(
    @Query() query: FindTransactionsDto,
    @Res() response: Response,
  ) {
    try {
      Readable.from(await this.exportService.exportResidue(query)).pipe(
        response,
      );
    } catch (e) {
      throw new HttpException(
        'Error creating generating invoice PDF.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
