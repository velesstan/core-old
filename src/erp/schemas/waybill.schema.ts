import { Schema } from 'mongoose';

import { StockRef } from './stock.schema';
import { TransactionRef } from './transaction.schema';

export const WaybillRef = 'WaybillRef';
export const WaybillSchema = new Schema(
  {
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
    serialNumber: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
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
    date: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

export const WaybillCounterRef = 'WaybillCounterRef';
export const WaybillCounterSchema = new Schema(
  {
    serialNumber: {
      type: Number,
      default: 0,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
