import { Document } from 'mongoose';

export interface Stock {
  readonly title: string;
}
export interface StockModel extends Stock, Document {}
