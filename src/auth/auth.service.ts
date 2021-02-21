import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(credentials: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(credentials.email);
    if (user && user.password === credentials.password) {
      const { password, ...payload } = user.toObject();
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }
}
