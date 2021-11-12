import { Injectable } from '@nestjs/common';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  // 해당 유저의 계좌번호가 존재하는지 찾기
  async findByUserIdAndAccount(
    accountsRepository: AccountsRepository,
    user: User,
    createTransactionDto: CreateTransactionDto,
  ): Promise<number> {
    const query = await accountsRepository
      .createQueryBuilder('account')
      .addSelect('user.user_id')
      .innerJoin('account.user', 'user')
      .where('user.user_id = :user_id', { user_id: user.user_id })
      .andWhere('account.acc_num = :acc_num', {
        acc_num: createTransactionDto.acc_num,
      })
      .getCount();
    return query;
  }

  // 해당 계좌의 거래내역중 최신 잔액(balance) 찾기
  async findByRecentBalance(account: Account): Promise<Transaction> {
    const query = await this.createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.account', 'account')
      .addSelect('account.acc_num')
      .where('account.acc_num = :acc_num', { acc_num: account.acc_num })
      .orderBy('transaction.createdAt', 'DESC')
      .getOne();
    return query;
  }
}
