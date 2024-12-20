import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsDate, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    type: 'string',
    required: true,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @MaxLength(50)
  fullName: string;

  @ApiProperty({
    description: 'User email address',
    type: 'string',
    required: true,
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User date of birth (YYYY-MM-DD)',
    type: 'string',
    required: true,
    example: '1995-10-01',
  })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({
    description: 'User password',
    type: 'string',
    required: true,
    example: 'password1234',
  })
  @IsNotEmpty()
  password: string;
}
