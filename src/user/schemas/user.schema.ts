import { Schema } from 'mongoose';

export const UserRef = 'UserRef';
export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    patronymic: String,
    refreshToken: String,
    refreshTokenExpires: Date,
  },
  {
    timestamps: true,
  },
);
