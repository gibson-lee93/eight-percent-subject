import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  acc_num: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  comments: string;
}
