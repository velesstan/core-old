import { IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { Stock } from '../interfaces';

export class CreateStockDto implements Stock {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform(({ value }) => value.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;
}
export class UpdateStockDto implements Stock {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform(({ value }) => value.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;
}
