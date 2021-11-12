import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-guard/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
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
    @GetUser() user: User,
  ): Promise<Transaction[]> {
    const limit = 5;
    const offset = query.page ? (Number(query.page) - 1) * limit : 0;

    return this.transactionService.getAllTransactions({
      ...query,
      limit,
      offset,
      user,
    });
  }
}
