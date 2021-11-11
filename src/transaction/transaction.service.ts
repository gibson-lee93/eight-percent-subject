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
      // 해당계좌 얻어오기
      const account = await accountsRepository.findOne({
        acc_num: createTransactionDto.acc_num,
      });

      // 해당계좌의 최신 잔액
      const balance = await transactionRepository.findByRecentBalance(account);
      console.log(balance);
      // const transaction = transactionRepository.create({...createTransactionDto, account, })
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
    return { message: 'ok' };
  }
}
