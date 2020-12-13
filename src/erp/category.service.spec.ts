import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { CategoryService } from './category.service';
import { CategoryRef, CategorySchema } from './schemas';

let mongod: MongoMemoryServer;

describe('Category Service', () => {
  let module: TestingModule;
  let categoryService: CategoryService;

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
        MongooseModule.forFeature([
          { name: CategoryRef, schema: CategorySchema },
        ]),
      ],
      providers: [CategoryService],
    }).compile();
    categoryService = module.get(CategoryService);
  });

  it('Category service should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  it('should create category', async () => {
    await categoryService.create({
      title: 'Венки',
      unit: 'м',
    });
    const result = await categoryService.find();
    expect(result[0].title).toBe('Венки');
    expect(result[0].unit).toBe('м');
  });

  it('should throw error for dublicate creation', async () => {
    await categoryService.create({
      title: 'Венки',
      unit: 'м',
    });
    await expect(
      categoryService.create({
        title: 'Венки',
        unit: 'м',
      }),
    ).rejects.toThrow();
  });

  it('should update category', async () => {
    let category$ = await categoryService.create({
      title: 'Венки',
      unit: 'м',
    });
    category$ = await categoryService.updateById(category$.id, {
      title: 'Веночки',
      unit: 'ед.',
    });
    expect(category$.title).toBe('Веночки');
    expect(category$.unit).toBe('ед.');
  });

  it('shoud remove category', async () => {
    const category$ = await categoryService.create({
      title: 'category',
      unit: 'unit',
    });
    expect((await categoryService.find()).length).toBe(1);
    await categoryService.removeById(category$.id);
    expect((await categoryService.find()).length).toBe(0);
  });
});