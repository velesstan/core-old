import { Document } from 'mongoose';

export interface Transaction {
    readonly product: string;
    readonly quantity: number;
    readonly stock: string;
}
export interface TransactionModel extends Transaction, Document {
    readonly createdAt: Date;
}