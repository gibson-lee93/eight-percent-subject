import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Min } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsNumber()
  @Min(0)
  money: number;
}
