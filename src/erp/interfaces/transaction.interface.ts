import { Document } from 'mongoose';

export interface Transaction {
  readonly stock: string;
  readonly product: string;
  readonly quantity: number;
}
export interface TransactionModel extends Transaction, Document {
  readonly createdAt: Date;
}
