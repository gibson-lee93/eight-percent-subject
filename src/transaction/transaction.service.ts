import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { AccountsRepository } from '../accounts/accounts.repository';
import { User } from '../users/entities/user.entity';
import { Connection } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
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
      // 해당 유저의 계좌번호로 계좌정보 가져오기
      const account = await accountsRepository.findOneByAccountNumber(
        createTransactionDto.acc_num,
        user,
      );

      // 해당계좌의 거래내역이 생성
      await transactionRepository.save(
        transactionRepository.create({
          ...createTransactionDto,
          balance: account.money + createTransactionDto.amount,
          trans_type: 'in',
          account,
        }),
      );

      // 해당계좌의 잔액 증가
      await accountsRepository.updateAccount(
        account.id,
        { money: account.money + createTransactionDto.amount },
        user,
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
    return { message: 'ok' };
  }

  async withdraw(
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
      // 해당 유저의 계좌번호로 계좌정보 가져오기
      const account = await accountsRepository.findOneByAccountNumber(
        createTransactionDto.acc_num,
        user,
      );

      //계좌의 잔액과 출금액을 비교해서 계좌의 잔액이 더 커야함
      await transactionRepository.compareMoneyAndAmount(
        account.money,
        createTransactionDto.amount,
      );

      // 해당계좌의 거래내역이 생성
      await transactionRepository.save(
        transactionRepository.create({
          ...createTransactionDto,
          balance: account.money - createTransactionDto.amount,
          trans_type: 'out',
          account,
        }),
      );

      // 해당계좌의 잔액 감소
      await accountsRepository.updateAccount(
        account.id,
        { money: account.money - createTransactionDto.amount },
        user,
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
    return { message: 'ok' };
  }
}
