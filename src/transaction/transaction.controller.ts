import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposit')
  deposit(
    @GetUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<{ message: string }> {
    return this.transactionService.deposit(user, createTransactionDto);
  }
}
