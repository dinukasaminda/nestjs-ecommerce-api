import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AddPreferenceDto {
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'The preference to add',
    example: 'Furniture',
  })
  preference: string;
}
