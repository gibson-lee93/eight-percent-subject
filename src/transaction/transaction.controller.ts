import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-auth.guard';
import { Transaction } from './entities/transaction.entity';
import { ListQueryOptions } from './transaction.interface';
import { TransactionService } from './transaction.service';
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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

  @Get('/:id')
  async findOneTransaction(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.getOneTransaction(Number(id));
  }
}
