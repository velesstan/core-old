import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    default: 'test@test.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    default: 'password',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  readonly password: string;
}
