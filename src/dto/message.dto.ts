import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'Response Message',
    type: 'string',
    required: true,
    example: 'User account activated successfully',
  })
  text: string;
}
