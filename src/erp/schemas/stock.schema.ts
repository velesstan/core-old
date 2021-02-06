import { Schema } from 'mongoose';

export const StockRef = 'StockRef';
export const StockSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
