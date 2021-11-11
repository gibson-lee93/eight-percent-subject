import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PagingOptions } from './transaction.interface';
import { TransactionRepository } from './transaction.repository';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getAllTransactions(query: PagingOptions): Promise<Transaction[]> {
    const result = this.transactionRepository.getAllTransactions(query);

    return result;
  }
}
