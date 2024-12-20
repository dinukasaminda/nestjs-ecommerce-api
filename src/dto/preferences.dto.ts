import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PreferenceDto {
  @ApiProperty({
    description: 'The preference id',
    example: 1,
  })
  id: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The preference to add',
    example: 'Furniture',
  })
  preference: string;
}
