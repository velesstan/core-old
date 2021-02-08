import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import dayjs from 'dayjs';
import { Transform } from 'class-transformer';

export class FindWaybillDto {
  @IsString()
  @IsOptional()
  readonly _id?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly serialNumber: number;

  @IsString()
  @IsOptional()
  readonly stock: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => dayjs.utc(value).startOf('day').toDate())
  readonly start?: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => dayjs.utc(value).endOf('day').toDate())
  readonly end?: Date;
}
