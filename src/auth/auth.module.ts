import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user';

import { JwtStrategy } from './strategies';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

import { RolesRef, RolesSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RolesRef,
        schema: RolesSchema,
      },
    ]),
    // PassportModule.register({
    //   defaultStrategy: 'jwt',
    // }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('APP_JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn:
              configService.get<number>('APP_JWT_ACCESS_TOKEN_EXPIRY_TIME')! *
              3600,
          },
        };
      },

      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
  ],
  controllers: [AuthController, RolesController],
  providers: [AuthService, JwtStrategy, RolesService],
})
export class AuthModule {}
