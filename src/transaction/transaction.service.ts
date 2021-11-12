import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsRepository } from '../accounts/accounts.repository';
import { Transaction } from './entities/transaction.entity';
import { PagingOptions } from './transaction.interface';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    // * 목록 조회에서 계좌의 소유주를 검증하기 위해 사용합니다.
    @InjectRepository(AccountsRepository)
    private readonly accountRepository: AccountsRepository,
  ) {}

  async getAllTransactions(query: PagingOptions): Promise<Transaction[]> {
    // * 계좌의 소유주인지 여부를 확인합니다.
    const account = await this.accountRepository.findOne(+query.account_id, {
      join: {
        alias: 'account',
        leftJoinAndSelect: { user: 'account.user' },
      },
    });
    if (!account) {
      throw new BadRequestException(
        '거래 내역에 등록한 계좌가 존재하지 않습니다.',
      );
    }
    if (account.user.user_id !== query.user.user_id) {
      throw new NotAcceptableException(
        '오직 계좌의 소유주만 해당 계좌의 거래 내역을 조회하실 수 있습니다.',
      );
    }
    const result = this.transactionRepository.getAllTransactions(query);
    return result;
  }
}
