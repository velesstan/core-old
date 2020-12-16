import { Schema } from 'mongoose';

import { ProductRef } from './product.schema';
import { StockRef } from './stock.schema';

export const TransactionRef = "TransactionRef";
export const TransactionSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: ProductRef,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: (value: number) => value !== 0
        }
    },
    stock: {
        type: Schema.Types.ObjectId,
        ref: StockRef,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    }
});