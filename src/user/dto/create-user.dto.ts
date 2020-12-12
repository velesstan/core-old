import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { IUser } from '../interfaces';

export class CreateUserDto implements IUser {
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
