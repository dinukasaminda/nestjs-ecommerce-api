import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserVerifyDto {
  @ApiProperty({
    description: 'User email address',
    type: 'string',
    required: true,
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  email: string;
}
