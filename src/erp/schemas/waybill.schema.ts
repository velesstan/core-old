import { Schema } from 'mongoose';

import { StockRef } from './stock.schema';
import { TransactionRef } from './transaction.schema';

export const WaybillRef = 'WaybillRef';
export const WaybillSchema = new Schema({
  action: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  stock: {
    type: Schema.Types.ObjectId,
    ref: StockRef,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  transactions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: TransactionRef,
      },
    ],
    required: true,
    validate: (v: []) => Array.isArray(v) && !!v.length,
  },
});
