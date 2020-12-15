import { Document } from 'mongoose';

export interface Role {
  value: string;
  title: string;
  description: string;
}

export interface RoleModel extends Role, Document {}
