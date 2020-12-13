import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { StockService } from './stock.service';
import { StockRef, StockSchema } from './schemas';

let mongod: MongoMemoryServer;

describe('Stock service', () => {
  let module: TestingModule;
  let stockService: StockService;

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
        MongooseModule.forFeature([{ name: StockRef, schema: StockSchema }]),
      ],
      providers: [StockService],
    }).compile();
    stockService = module.get(StockService);
  });

  it('service should be defined', () => {
    expect(stockService).toBeDefined();
  });

  it('should create stock', async () => {
    const stock$ = await stockService.create({
      title: 'Stock',
      waybillPrefix: 'S',
    });
    expect(stock$).toMatchObject({ title: 'Stock', waybillPrefix: 'S' });
  });

  it('should remove stock', async () => {
    const stock$ = await stockService.create({
      title: 'Stock',
      waybillPrefix: 'S',
    });
    await stockService.removeById(stock$.id);
    const found = await stockService.getById(stock$.id);
    expect(found).toBe(null);
  });

  it('should throw error for dublicate name', async () => {
    await stockService.create({
      title: 'Stock',
      waybillPrefix: 'S1',
    });
    await expect(
      stockService.create({
        title: 'Stock',
        waybillPrefix: 'S2',
      }),
    ).rejects.toThrow();
  });

  it('should throw error for dublicate waybill prefix', async () => {
    await stockService.create({
      title: 'Stock-1',
      waybillPrefix: 'S',
    });
    await expect(
      stockService.create({
        title: 'Stock-2',
        waybillPrefix: 'S',
      }),
    ).rejects.toThrow();
  });

  it('should get all stocks', async () => {
    await stockService.create({
      title: 'Stock',
      waybillPrefix: 'S',
    });
    await stockService.create({
      title: 'Stock-2',
      waybillPrefix: 'S-C',
    });
    expect((await stockService.find()).length).toBe(2);
  });
});
