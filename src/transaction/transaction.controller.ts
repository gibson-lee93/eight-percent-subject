import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposit')
  deposit(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<{ message: string }> {
    return this.transactionService.deposit(createTransactionDto);
  }
}
