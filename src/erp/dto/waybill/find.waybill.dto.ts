import { IsString, IsOptional } from 'class-validator';

export class FindWaybillDto {
  @IsString()
  @IsOptional()
  readonly _id?: string;
}
