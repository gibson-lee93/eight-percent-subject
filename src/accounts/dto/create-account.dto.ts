import { IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  acc_num: string;
}
