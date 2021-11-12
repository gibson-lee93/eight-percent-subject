import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { AccountsRepository } from 'src/accounts/accounts.repository';
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
      // 입금 일 경우만 허용
      if (createTransactionDto.trans_type !== 'in') {
        throw new BadRequestException('trans_type');
      }

      // 해당계좌 얻어오기
      const account = await accountsRepository.findOne({
        acc_num: createTransactionDto.acc_num,
      });

      // 해당계좌의 거래내역중 최신 잔액
      const transaction = await transactionRepository.findByRecentBalance(
        account,
      );

      // console.log(transaction.balance);
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
