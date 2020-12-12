import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    default: 'test',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    default: 'test',
  })
  @IsString()
  readonly password: string;
}
