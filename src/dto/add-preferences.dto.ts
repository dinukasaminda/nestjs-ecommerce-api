import { IsNotEmpty } from 'class-validator';

export class AddPreferenceDto {
  @IsNotEmpty()
  preference: string;
}
