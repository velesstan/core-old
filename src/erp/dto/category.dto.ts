import {
  MinLength,
  MaxLength,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { Category } from '../interfaces';

export class CreateCategoryDto implements Category {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform(({ value }) => value.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  readonly sortPriority: number;
}
export class UpdateCategoryDto implements Category {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform(({ value }) => value.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  readonly sortPriority: number;
}
