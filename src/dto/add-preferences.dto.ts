import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddPreferenceDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The preference to add',
    example: 'Furniture',
  })
  preference: string;
}
