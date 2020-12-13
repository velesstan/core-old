import { Document } from 'mongoose';

export interface User {
  readonly email: string;
  readonly password: string;
}
export interface UserModel extends User, Document {}
