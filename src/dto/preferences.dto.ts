import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from './user.dto';
import { Exclude } from 'class-transformer';

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
  name: string;

  @Exclude()
  user: UserDto;
}
