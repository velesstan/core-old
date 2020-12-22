import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDate } from 'class-validator';
import dayjs from 'dayjs';

export class FindTransactionsDto {
  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly stock?: string;

  @IsOptional()
  @IsDate()
  @Transform((v: string) => dayjs.utc(v).startOf('day').toDate())
  readonly start?: Date;

  @IsOptional()
  @IsDate()
  @Transform((v: string) => dayjs.utc(v).endOf('day').toDate())
  readonly end?: Date;
}
