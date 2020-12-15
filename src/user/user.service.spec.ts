import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { UserService } from './user.service';
import { UserRef, UserSchema } from './schemas';

let mongod: MongoMemoryServer;

describe('User Service', () => {
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

  it('should find all users ', async () => {
    expect(await userService.find()).toHaveLength(0);
  });
});
