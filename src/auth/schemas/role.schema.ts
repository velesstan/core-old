import { Schema } from 'mongoose';

export const RoleRef = 'RoleRef';

export const RoleSchema = new Schema(
  {
    value: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
