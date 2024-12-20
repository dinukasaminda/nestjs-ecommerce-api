import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsDate } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: 'User email address',
    type: 'string',
    required: true,
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    type: 'string',
    required: true,
    example: 'password1234',
  })
  @IsNotEmpty()
  password: string;
}
