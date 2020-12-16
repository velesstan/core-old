import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { AppModule } from './app/app.module';
import APIDocs from './swagger.api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerApiDocs = SwaggerModule.createDocument(app, APIDocs);
  SwaggerModule.setup('api/swagger', app, swaggerApiDocs);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
