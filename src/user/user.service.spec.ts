import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { UserRef, UserSchema } from './schemas';
import { UserService } from './user.service';

let mongod: MongoMemoryServer;

describe('User service', () => {
  let module: TestingModule;
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
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([{ name: UserRef, schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();
    userService = module.get(UserService);
  });

  it('service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create admin user if not exist', async () => {
    userService.create = jest.fn();
    await userService.bootstrap();
    expect(userService.create).toHaveBeenCalled();
  });

  it('should not create admin user if already exist', async () => {
    await userService.create({
      email: 'admin@veles.services',
      password: 'admin',
    });
    userService.create = jest.fn();
    await userService.bootstrap();
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('should find users', async () => {
    expect(await userService.find()).toHaveLength(0);
  });

  it('should update user by id', async () => {
    let $user = await userService.create({
      email: 'admin@veles.services',
      password: 'temp',
    });
    $user = await userService.updateById($user._id, {
      email: $user.email,
      password: 'admin',
    });
    expect($user).toMatchObject({
      email: 'admin@veles.services',
      password: 'admin',
    });
  });

  it('should remove user by id', async () => {
    const $user = await userService.create({
      email: 'email',
      password: 'password',
    });
    await userService.removeById($user._id);
    expect(await userService.findOneByEmail('email')).toBe(null);
  });
});
