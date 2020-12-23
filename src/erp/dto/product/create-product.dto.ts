import {
  IsString,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { Product } from '../../interfaces';

export class CreateProductDto implements Product {
  @IsString()
  @Length(24)
  readonly category: string;
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @Transform((v: string) => v.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly code: string;
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform((v: string) => v.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;
  @IsNumber()
  @IsPositive()
  @Transform((n) => Number(n))
  readonly price_retail: number;
}
