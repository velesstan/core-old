import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { User } from '../interfaces';

export class CreateUserDto implements User {
  @ApiProperty({
    default: 'test@test.com',
    name: 'email',
  })
  @IsEmail()
  readonly email: string;
  @ApiProperty({
    default: 'password',
    name: 'password',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  readonly password: string;

  @ApiProperty({
    name: 'firstName',
  })
  readonly firstName: string;

  @ApiProperty({
    name: 'lastName',
  })
  readonly lastName: string;

  @ApiProperty({
    name: 'patronymic',
  })
  readonly patronymic: string;
}
