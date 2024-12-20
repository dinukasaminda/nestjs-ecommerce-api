import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResDto {
  @ApiProperty({
    description: 'User authnetication token',
    type: 'string',
    required: true,
    example: 'ey...',
  })
  accessToken: string;
}
