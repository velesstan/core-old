import { Document } from 'mongoose';

export interface Product {
  readonly code: string;
  readonly title: string;
  readonly category: string;
  readonly price_retail: number;
}

export interface ProductModel extends Product, Document {}
