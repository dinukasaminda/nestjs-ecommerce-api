import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsDate } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    type: 'number',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'User full name',
    type: 'string',
    required: true,
    example: 'John Doe',
  })
  @IsNotEmpty()
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
  dateOfBirth: Date;
}
