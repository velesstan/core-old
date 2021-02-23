import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import randtoken from 'rand-token';
import dayjs from 'dayjs';

import { UserService } from '../user';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    credentials: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findOneByEmail(credentials.email);
    if (user && user.password === credentials.password) {
      const {
        password,
        refreshToken,
        refreshTokenExpires,
        ...payload
      } = user.toObject();
      const refresh_token = await this.generateRefreshToken(user._id);
      return {
        access_token: this.jwtService.sign({ ...payload, refresh_token }),
        refresh_token,
      };
    }
    throw new UnauthorizedException();
  }

  async refreshTokens(
    userId: string,
    token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = (await this.userService.findById(userId)).toObject();
    if (user.refreshToken !== token) {
      throw new UnauthorizedException();
    }
    if (dayjs().diff(dayjs(user.refreshTokenExpires), 'seconds') > 10) {
      throw new UnauthorizedException();
    }

    const { password, refreshToken, refreshTokenExpires, ...payload } = user;
    const refresh_token = await this.generateRefreshToken(userId);
    return {
      access_token: this.jwtService.sign({ ...payload, refresh_token }),
      refresh_token,
    };
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = randtoken.generate(16);
    const expiryDate = dayjs().add(10, 'days');
    await this.userService.setRefreshToken(
      userId,
      refreshToken,
      expiryDate.toDate(),
    );
    return refreshToken;
  }
}
