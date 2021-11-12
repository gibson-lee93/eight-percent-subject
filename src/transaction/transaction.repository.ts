import { EntityRepository, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Transaction } from './entities/transaction.entity';
import { PagingOptions } from './transaction.interface';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async getAllTransactions({
    limit,
    offset,
    startDate,
    endDate,
    account_id,
  }: PagingOptions): Promise<Transaction[]> {
    let startDateString = '';
    let endDateString = '';
    if (startDate) {
      startDateString = `${startDate} 00:00:00`;
    } else {
      startDateString = moment()
        .tz('Asia/Seoul')
        .add(-3, 'month')
        .set({ hour: 0, minute: 0, second: 0 })
        .format('YYYY-MM-DD HH:mm:ss');
    }
    if (endDate) {
      endDateString = `${endDate} 23:59:59`;
    } else {
      endDateString = moment()
        .tz('Asia/Seoul')
        .set({ hour: 23, minute: 59, second: 59 })
        .format('YYYY-MM-DD HH:mm:ss');
    }
    const transaction = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.id = :account_id', { account_id })
      .andWhere('transaction.createdAt >= :startDate', {
        startDate: startDateString,
      })
      .andWhere('transaction.createdAt <= :endDate', {
        endDate: endDateString,
      })
      .limit(limit)
      .offset(offset)
      .getMany();
    // console.log(transaction);
    return transaction;
  }

  async getOneTransaction(id: number) {
    return this.findOne(id);
  }
}
