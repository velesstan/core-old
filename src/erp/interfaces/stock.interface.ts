import { Document } from 'mongoose';

export interface Stock {
  readonly title: string;
  readonly waybillPrefix: string;
}
export interface StockModel extends Stock, Document {
  readonly outcomeWaybillCount: number;
  readonly incomeWaybillCount: number;
}
