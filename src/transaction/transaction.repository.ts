import { Injectable } from '@nestjs/common';
import { Account } from 'src/accounts/entities/account.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async findByRecentBalance(account: Account): Promise<any> {
    const query = this.createQueryBuilder('account')
      // select balance,create ffrom trans join acount on transformAuthInfo.id = ac.id where account.acnum=acc.acum orderby createdat desc
      .innerJoin('account.transactions', 'transacion')
      .where('account.acc_num = :acc_num', { acc_num: account.acc_num })
      .getMany();
    return query;
  }
}
