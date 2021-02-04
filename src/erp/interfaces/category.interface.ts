import { Document } from 'mongoose';

export interface Category {
  readonly title: string;
}

export interface CategoryModel extends Category, Document {}
