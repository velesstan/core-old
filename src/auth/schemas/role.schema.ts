import { Schema } from 'mongoose';

export const RolesRef = 'Roles';

export const RolesSchema = new Schema(
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
