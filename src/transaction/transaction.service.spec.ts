import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountsRepository } from '../accounts/accounts.repository';
import { Account } from '../accounts/entities/account.entity';
import {
  Connection,
  getCustomRepository,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AccountsService } from 'src/accounts/accounts.service';

const mockTransactionRepository = () => ({
  save: jest.fn(),
  create: jest.fn(),
});

const mockAccountsRepository = () => ({
  findOneByAccountNumber: jest.fn(),
  updateAccount: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TransactionService', () => {
  let service: TransactionService;
  let connection: Connection;
  let accountsRepository: AccountsRepository;
  let transactionRepository: TransactionRepository;

  const qr = {
    manager: {},
  } as QueryRunner;

  class ConnectionMock {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return qr;
    }
  }

  beforeEach(async () => {
    Object.assign(qr.manager, {
      save: jest.fn(),
    });
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    qr.manager.getCustomRepository = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useFactory: mockTransactionRepository,
        },
        {
          provide: AccountsRepository,
          useFactory: mockAccountsRepository,
        },
        { provide: Connection, useClass: ConnectionMock },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    connection = module.get<Connection>(Connection);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(connection).toBeDefined();
    expect(transactionRepository).toBeDefined();
    expect(accountsRepository).toBeDefined();
  });

  const user: User = {
    id: 1,
    user_id: '1',
    password: '123',
    hashPassword: undefined,
    loginedAt: new Date(),
    accounts: null,
    deletedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  const createTransactionDto: CreateTransactionDto = {
    acc_num: 'testNum',
    amount: 1000,
    comments: 'testComments',
  };

  describe('deposit', () => {
    let queryRunner: QueryRunner;

    beforeEach(() => {
      queryRunner = connection.createQueryRunner();
      jest.spyOn(queryRunner, 'connect').mockResolvedValueOnce(undefined);
    });

    afterEach(() => {
      jest.spyOn(queryRunner, 'release').mockResolvedValue();
    });

    const user: User = {
      id: 1,
      user_id: '1',
      password: '123',
      hashPassword: undefined,
      loginedAt: new Date(),
      accounts: null,
      deletedAt: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    const createTransactionDto: CreateTransactionDto = {
      acc_num: 'testNum',
      amount: 1000,
      comments: 'testComments',
    };
    const accoutObject: Account = {
      id: 1,
      acc_num: 'test',
      money: 100,
      user: null,
      deletedAt: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactions: null,
    };

    it('계좌입금에 성공', async () => {
      jest
        .spyOn(queryRunner.manager, 'getCustomRepository')
        .mockReturnValueOnce(undefined);
      jest
        .spyOn(queryRunner, 'startTransaction')
        .mockResolvedValueOnce(undefined);

      jest
        .spyOn(accountsRepository, 'findOneByAccountNumber')
        .mockResolvedValue(accoutObject);
      // jest.spyOn(transactionRepository, 'save').mockResolvedValue(undefined);
      // jest
      //   .spyOn(accountsRepository, 'updateAccount')
      //   .mockResolvedValue(undefined);
      // accountsRepository.findOneByAccountNumber.
      const result = await service.deposit(user, createTransactionDto);

      expect(result).toEqual({ message: 'ok' });
    });
  });
});
