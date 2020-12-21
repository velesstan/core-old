import { Document } from 'mongoose';

import { Transaction, TransactionModel } from './transaction.interface';

export enum WayBillAction {
  SELL = 'SELL',
  UTILIZATION = 'UTILIZATION',
  BUY = 'BUY',
  IMPORT = 'IMPORT',
  MOVE = 'MOVE',
  PRODUCTION = 'PRODUCTION',
}

export enum WaybillType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}
export interface Waybill {
  readonly stock: string; // stock id
  readonly title: string;
  readonly action: WayBillAction; // action (import/sell/buy)
  readonly type: WaybillType; // income or outcome
  readonly transactions: Transaction[]; // transactions with snapshot
}
export interface WaybillModel extends Waybill, Document {
  readonly createdAt: Date;
  readonly transactions: TransactionModel[];
}
