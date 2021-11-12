import { IsInt, IsString, Min } from 'class-validator';

export class CreateTransactionDto {

  @IsString()
  acc_num: string;

  @IsString()
  acc_num: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  comments: string;
}
