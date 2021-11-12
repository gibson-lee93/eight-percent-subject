import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  //계좌의 잔액과 출금액을 비교해서 계좌의 잔액이 더 커야함
  compareMoneyAndAmount(money: number, amount: number) {
    if (money < amount) {
      throw new BadRequestException('계좌의 잔액이 부족합니다.');
    }
  }
}
