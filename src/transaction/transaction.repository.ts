import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { ListQueryOptions, PagingOptions } from './transaction.interface';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async getAllTransactions({
    limit,
    offset,
    startDate,
    endDate,
  }: PagingOptions): Promise<Transaction[]> {
    const transaction = await this.createQueryBuilder('transaction')
      // .where(startDate, endDate)
      .where('createdAt >= :startDate', {
        startDate,
      })
      .andWhere('createdAt <= :endDate', { endDate })
      .limit(limit)
      .offset(offset)
      .getMany();
    return transaction;
  }
}
