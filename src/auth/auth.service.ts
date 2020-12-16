import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserService } from '../user';

import { SignInDto } from './dto';
import { RoleModel } from './interfaces';
import { RoleRef } from './schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RoleRef) private readonly rolesModel: Model<RoleModel>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(credentials: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(credentials.email);
    if (user && user.password === credentials.password) {
      const payload = { username: user.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }
}
