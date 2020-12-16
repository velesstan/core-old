import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { RoleRef, RoleSchema } from './schemas';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';

import { UserService } from '../user';
import { UserRef, UserSchema } from '../user/schemas';

let mongod: MongoMemoryServer;

describe('Auth service', () => {
  let module: TestingModule;
  let authService: AuthService;
  let userService: UserService;

  afterEach(async () => {
    await module.close();
    await mongod.stop();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'some-secret',
          signOptions: {
            expiresIn: 20,
          },
        }),
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: RoleRef, schema: RoleSchema },
          { name: UserRef, schema: UserSchema },
        ]),
      ],
      providers: [AuthService, RoleService, UserService],
    }).compile();
    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  it('service should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should sign in and return access_token for valid user', async () => {
    await userService.create({
      email: 'admin@veles.services',
      password: 'pass',
    });
    const token = await authService.signIn({
      email: 'admin@veles.services',
      password: 'pass',
    });
    expect(token).not.toBe(null);
  });

  it('should throw unauthorized error for invalid credentials', async () => {
    await expect(
      authService.signIn({ email: 'invalid', password: 'invalid' }),
    ).rejects.toThrow('Unauthorized');
  });
});
