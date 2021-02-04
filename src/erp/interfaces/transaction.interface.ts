import { Document } from 'mongoose';

interface ProductSnapshot {
  readonly price: number;
  readonly reduce: boolean;
}

export interface Transaction {
  readonly stock: string;
  readonly product: string;
  readonly quantity: number;
  readonly snapshot?: ProductSnapshot;
}
export interface TransactionModel extends Transaction, Document {
  readonly createdAt: Date;
  readonly active: boolean;
}
