import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { User } from 'src/users/entities/user.entity';
import {
  Connection,
  EntityManager,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
    @InjectConnection()
    private connection: Connection,
  ) {}

  async deposit(
    user: User,
    createTransactionDto: CreateTransactionDto,
  ): Promise<{ message: string }> {
    // queryRunner 커넥션
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    // customRepo 연결
    const transactionRepository = queryRunner.manager.getCustomRepository(
      TransactionRepository,
    );
    const accountsRepository =
      queryRunner.manager.getCustomRepository(AccountsRepository);

    // 트랜잭션 시작
    await queryRunner.startTransaction();
    try {
      // 입금 trans_type===in 경우만 허용
      if (createTransactionDto.trans_type !== 'in') {
        throw new BadRequestException('trans_type');
      }

      // 해당 유저의 계좌번호가 존재 하는지 확인
      const found = await transactionRepository.findByUserIdAndAccount(
        accountsRepository,
        user,
        createTransactionDto,
      );
      if (found < 1) {
        throw new BadRequestException('acc_num');
      }

      // 해당계좌 얻어오기
      const account = await accountsRepository.findOne({
        acc_num: createTransactionDto.acc_num,
      });

      // 해당계좌의 거래내역중 최신 잔액
      const transaction = await transactionRepository.findByRecentBalance(
        account,
      );

      // 해당계좌의 거래내역이 없는 경우(처음 거래)
      if (!transaction) {
        transactionRepository.save(
          transactionRepository.create({
            ...createTransactionDto,
            balance: createTransactionDto.amount,
            account,
          }),
        );
        // 해당계좌의 거래내역이 있는 경우
      } else {
        transactionRepository.save(
          transactionRepository.create({
            ...createTransactionDto,
            balance: transaction.balance + createTransactionDto.amount,
            account,
          }),
        );
      }

      // 해당계좌의 잔액 증가
      account.money += createTransactionDto.amount;
      // 순환 참조때문에 문제가 생긴듯 그래서 삭제
      delete account.transactions;
      await accountsRepository.save(
        accountsRepository.create({
          ...account,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      let message = '';
      if (e.message === 'trans_type') {
        message = 'trans_type이 정확하지 않습니다.';
      } else if (e.message === 'acc_num') {
        message = 'acc_num(계좌번호)가 정확하지 않습니다.';
      }
      throw new BadRequestException(message);
    } finally {
      await queryRunner.release();
    }
    return { message: 'ok' };
  }
}
