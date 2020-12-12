import { Document } from 'mongoose';

export interface IRole {
  value: string;
  title: string;
  description: string;
}

export interface IRoleModel extends IRole, Document {}
