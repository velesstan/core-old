import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import decode from 'jwt-decode';

import { AuthService } from './auth.service';

import { SignInDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() credentials: SignInDto) {
    return this.authService.signIn(credentials);
  }

  @Post('/refreshToken')
  async refreshToken(
    @Headers('authorization') authorization: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = decode<any>(authorization.split(' ')[1]);
      const { _id, refresh_token } = payload;
      return await this.authService.refreshTokens(_id, refresh_token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
