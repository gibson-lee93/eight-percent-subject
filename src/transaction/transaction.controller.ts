import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-guard/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListQueryOptions } from './transaction.interface';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
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

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOneTransaction(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.getOneTransaction(Number(id));
  }

  @Post('/deposit')
  deposit(
    @GetUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<{ message: string }> {
    return this.transactionService.deposit(user, createTransactionDto);
  }

  @Post('/withdraw')
  withdraw(
    @GetUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<{ message: string }> {
    return this.transactionService.withdraw(user, createTransactionDto);
  }
}
