import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { RoleService } from './role.service';
import { RoleRef, RoleSchema } from './schemas';

let mongod: MongoMemoryServer;

describe('Role Service', () => {
  let module: TestingModule;
  let roleService: RoleService;

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
        MongooseModule.forFeature([{ name: RoleRef, schema: RoleSchema }]),
      ],
      providers: [RoleService],
    }).compile();
    roleService = module.get(RoleService);
  });

  it('service should be defined', () => {
    expect(roleService).toBeDefined();
  });

  it('should find all roles ', async () => {
    expect(await roleService.find()).toHaveLength(0);
  });
});
