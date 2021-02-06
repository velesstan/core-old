import { Document } from 'mongoose';

import { Transaction, TransactionModel } from './transaction.interface';

export enum WaybillAction {
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
  readonly serialNumber: number;
  readonly action: WaybillAction; // action (import/sell/buy)
  readonly type: WaybillType; // income or outcome
  readonly transactions: Transaction[]; // transactions with snapshot
  readonly date?: Date;
}
export interface WaybillModel extends Waybill, Document {
  readonly active: boolean;
  readonly createdAt: Date;
  readonly date: Date;
  readonly transactions: TransactionModel[];
}

export interface WaybillCounter {
  readonly serialNumber: number;
}
export interface WaybillCounterModel extends WaybillCounter, Document { }