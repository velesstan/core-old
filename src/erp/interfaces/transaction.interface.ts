import { Document } from 'mongoose';

import { WaybillAction, WaybillType } from './enums';

export interface TransactionSnapshot {
  readonly price: number;
}
export interface Transaction {
  readonly product: string;
  readonly stock: string;
  readonly quantity: number;
  readonly waybill: {
    readonly type: WaybillType;
    readonly action: WaybillAction;
    readonly id: string;
    readonly date: Date;
  };
  readonly snapshot: TransactionSnapshot;
}
export interface TransactionModel extends Transaction, Document {}
