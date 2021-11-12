import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '../accounts/entities/account.entity';
import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

jest.mock('./transaction.service');

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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

  const mockAccount = new Account();
  mockAccount.id = 1;
  mockAccount.acc_num = '123-456-789';
  mockAccount.money = 100000;
  const mockTransaction = new Transaction();
  mockTransaction.id = 1;
  mockTransaction.amount = 1000;
  mockTransaction.comments = 'new transaction';
  mockTransaction.balance = 500;
  mockTransaction.createdAt = new Date();

  describe('deposit', () => {
    it('입금', async () => {
      jest.spyOn(service, 'deposit').mockResolvedValue({ message: 'ok' });
      const result = await controller.deposit(user, createTransactionDto);
      expect(result).toEqual({ message: 'ok' });
    });
  });
  describe('withdraw', () => {
    it('출금', async () => {
      jest.spyOn(service, 'withdraw').mockResolvedValue({ message: 'ok' });
      const result = await controller.withdraw(user, createTransactionDto);
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('getMany', () => {
    const mockListQuery = {
      acc_num: '01234567890',
      page: '1',
      startDate: '2021-11-01',
      endDate: '2021-11-13',
    };

    it('입금 목록을 출력합니다.', async () => {
      mockTransaction.trans_type = 'in';
      mockTransaction.account = mockAccount;
      Object.assign(mockListQuery, { trans_type: 'in' });
      jest
        .spyOn(service, 'getAllTransactions')
        .mockResolvedValue([mockTransaction]);

      const expectedResult = await controller.getAllTransactions(
        mockListQuery,
        user,
      );
      expect(expectedResult).toMatchObject([mockTransaction]);
    });
    it('출금 목록을 출력합니다.', async () => {
      mockTransaction.trans_type = 'out';
      mockTransaction.account = mockAccount;
      Object.assign(mockListQuery, { trans_type: 'out' });
      jest
        .spyOn(service, 'getAllTransactions')
        .mockResolvedValue([mockTransaction]);

      const expectedResult = await controller.getAllTransactions(
        mockListQuery,
        user,
      );
      expect(expectedResult).toMatchObject([mockTransaction]);
    });
    it('입금, 출금 목록을 출력합니다.', async () => {
      mockTransaction.trans_type = 'in';
      mockTransaction.account = mockAccount;
      const mockWithdrawTransaction = new Transaction();
      mockWithdrawTransaction.id = 2;
      mockWithdrawTransaction.amount = 1000;
      mockWithdrawTransaction.comments = 'new transaction';
      mockWithdrawTransaction.balance = 500;
      mockWithdrawTransaction.createdAt = new Date();
      mockWithdrawTransaction.account = mockAccount;

      Object.assign(mockListQuery);
      jest
        .spyOn(service, 'getAllTransactions')
        .mockResolvedValue([mockTransaction, mockWithdrawTransaction]);

      const expectedResult = await controller.getAllTransactions(
        mockListQuery,
        user,
      );
      expect(expectedResult).toMatchObject([
        mockTransaction,
        mockWithdrawTransaction,
      ]);
    });
  });

  describe('findOne', () => {
    it('거래내역을 조회한다.', async () => {
      mockTransaction.trans_type = 'in';
      mockTransaction.account = mockAccount;
      const id = '1';
      jest
        .spyOn(service, 'getOneTransaction')
        .mockResolvedValue(mockTransaction);
      const expectTransaction = await controller.findOneTransaction(id);
      expect(expectTransaction).toMatchObject(mockTransaction);
    });
  });
});
