import { Module } from '@nestjs/common';

import { DocumentService } from './document.service';

@Module({
  providers: [DocumentService],
})
export class DocumentModule {}
