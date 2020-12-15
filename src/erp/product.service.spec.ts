import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import {
  CategoryRef,
  CategorySchema,
  ProductRef,
  ProductSchema,
} from './schemas';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { CategoryModel } from './interfaces';

let mongod: MongoMemoryServer;

describe('Product service', () => {
  let module: TestingModule;
  let productService: ProductService;
  let categoryService: CategoryService;
  let category: CategoryModel;

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
          { name: ProductRef, schema: ProductSchema },
          { name: CategoryRef, schema: CategorySchema },
        ]),
      ],
      providers: [ProductService, CategoryService],
    }).compile();
    productService = module.get(ProductService);
    categoryService = module.get(CategoryService);
    category = await categoryService.create({
      title: 'Category',
      unit: 'unit',
    });
  });

  it('service should be defined', () => {
    expect(productService).toBeDefined();
  });

  it('should create product', async () => {
    const product$ = await productService.create({
      title: 'Product',
      category: category._id,
      code: 'product-1',
      price: 300,
    });
    expect(product$).toMatchObject({
      title: 'Product',
      code: 'product-1',
      price: 300,
    });
  });

  it('should update product', async () => {
    let product$ = await productService.create({
      title: 'Product',
      category: category._id,
      code: 'product-1',
      price: 300,
    });
    product$ = await productService.updateById(product$._id, {
      title: 'Product',
      category: category._id,
      code: 'product-2',
      price: 330,
    });
    expect(product$).toMatchObject({
      title: 'Product',
      code: 'product-2',
      price: 330,
    });
  });

  it('should remove product', async () => {
    const product$ = await productService.create({
      title: 'Product',
      category: category._id,
      code: 'product-1',
      price: 300,
    });
    await productService.removeById(product$._id);
    expect(await productService.getById(product$._id)).toBe(null);
  });

  it('should throw error for dublicate code', async () => {
    await productService.create({
      title: 'Product',
      category: category._id,
      code: 'product-1',
      price: 300,
    });
    await expect(
      productService.create({
        title: 'Product',
        category: category._id,
        code: 'product-1',
        price: 300,
      }),
    ).rejects.toThrow();
  });

  it('should get all products', async () => {
    expect(await productService.find()).toHaveLength(0);
  });
});
