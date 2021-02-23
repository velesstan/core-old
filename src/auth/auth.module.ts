import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user';

import { JwtStrategy } from './strategies';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesController } from './roles.controller';
import { RoleService } from './role.service';

import { RoleRef, RoleSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoleRef,
        schema: RoleSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('APP_JWT_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<number>('APP_JWT_TOKEN_EXPIRY'),
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
  providers: [AuthService, JwtStrategy, RoleService],
})
export class AuthModule {}
