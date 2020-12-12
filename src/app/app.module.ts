import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import CONFIG, { ENV_SCHEMA } from '../env.schema';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from '../user';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.APP_ENV}.env`,
      validationSchema: ENV_SCHEMA,
      load: [CONFIG],
      validationOptions: {
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('DB_CONNECTION'),
          useCreateIndex: true,
        };
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
