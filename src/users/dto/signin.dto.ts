import { IsString } from 'class-validator';

export class SigninDto {
  @IsString()
  user_id: string;

  @IsString()
  password: string;
}
