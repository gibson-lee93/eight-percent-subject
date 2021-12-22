import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Transaction } from './entities/transaction.entity';
import { ListWithPageAndUserOptions } from './transaction.interface';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  private getDatePeriod(
    startDate: string | undefined,
    endDate: string | undefined,
  ): [string, string] {
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
    return [startDateString, endDateString];
  }

  async getAllTransactions({
    limit,
    offset,
    trans_type,
    startDate,
    endDate,
    acc_num,
  }: ListWithPageAndUserOptions): Promise<Transaction[]> {
    const [startDateString, endDateString] = this.getDatePeriod(
      startDate,
      endDate,
    );
    // * 입금, 출금 필터링. 1. 입금, 2. 출금, 3. 입출금 으로 구분합니다.
    let transTypeQuery: any = [
      'transaction.trans_type = :trans_type',
      { trans_type },
    ];
    if (!trans_type) {
      transTypeQuery = [
        'transaction.trans_type IN (:...trans_type)',
        { trans_type: ['in', 'out'] },
      ];
    }
    const transaction = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.acc_num = :acc_num', { acc_num })
      .andWhere('transaction.createdAt >= :startDate', {
        startDate: startDateString,
      })
      .andWhere('transaction.createdAt <= :endDate', {
        endDate: endDateString,
      })
      .andWhere(transTypeQuery[0], transTypeQuery[1])
      .limit(limit) // * Pagination 기능
      .offset(offset) // * Pagination 기능
      .select([
        'transaction.id',
        'transaction.createdAt',
        'transaction.amount',
        'transaction.balance',
        'transaction.trans_type',
        'transaction.comments',
      ])
      .getMany();

    return transaction;
  }

  compareMoneyAndAmount(money: number, amount: number) {
    if (money < amount) {
      throw new BadRequestException('계좌의 잔액이 부족합니다.');
    }
  }
}
