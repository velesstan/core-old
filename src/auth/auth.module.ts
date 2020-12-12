import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_TOKEN_EXPIRY')! * 3600,
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
