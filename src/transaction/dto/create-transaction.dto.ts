import { IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  acc_num: string;

  @IsString()
  amount: string;

  @IsString()
  comments: string;
}
