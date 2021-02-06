import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindWaybillDto {
  @IsString()
  @IsOptional()
  readonly _id?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly serialNumber: number;
}
