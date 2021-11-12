import { Injectable } from '@nestjs/common';
import { Account } from 'src/accounts/entities/account.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async findByRecentBalance(account: Account): Promise<Transaction> {
    const query = await this.createQueryBuilder('transaction')
      .innerJoin('transaction.account', 'account')
      .where('account.acc_num = :acc_num', { acc_num: account.acc_num })
      .orderBy('transaction.createdAt', 'DESC')
      .getOne();
    return query;
  }
}
