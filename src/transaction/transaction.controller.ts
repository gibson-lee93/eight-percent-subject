import { Controller, Get, Param, Query } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { ListQueryOptions } from './transaction.interface';
import { TransactionService } from './transaction.service';
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(
    @Query() query: ListQueryOptions,
  ): Promise<Transaction[]> {
    const limit = 5;
    const offset = query.page ? (Number(query.page) - 1) * Number(limit) : 0;
    // const account_id;
    return this.transactionService.getAllTransactions({
      ...query,
      limit,
      offset,
    });
  }

  // @Get(':/id')
  // async getOneTransaction(@Param('id') id: string): Promise<Transaction> {
  //   return this.transactionService.getOneTransaction(+id);
  // }
}
