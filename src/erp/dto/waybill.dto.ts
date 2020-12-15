import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsPositive,
  IsEnum,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

import { WayBillAction } from '../interfaces/waybill.interface';

class ProductSnapshotDto {
  @IsNumber()
  @IsPositive()
  readonly price: number;
}

class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly product: string;
  @IsNumber()
  @IsPositive()
  readonly quantity: number;
  @ValidateNested()
  @Type(() => ProductSnapshotDto)
  readonly snapshot: ProductSnapshotDto;
}

export class CreateWaybillDto {
  @IsEnum(WayBillAction)
  @IsNotEmpty()
  readonly action: WayBillAction;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly source?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly destination?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  readonly products: ProductDto[];
}
