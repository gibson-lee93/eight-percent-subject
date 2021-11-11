import { IsInt, IsString, Min } from 'class-validator';

export class CreateTransactionDto {

  @IsString()
  acc_num: string;

  @IsString()
  trans_type: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  comments: string;
}
