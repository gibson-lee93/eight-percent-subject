import { IsInt, IsString, Min, min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  trans_type: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  comments: string;
}
