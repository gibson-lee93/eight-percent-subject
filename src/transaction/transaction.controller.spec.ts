import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
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
  describe('deposit', () => {
    it('입금', async () => {
      jest.spyOn(service, 'deposit').mockResolvedValue({ message: 'ok' });
      const result = await controller.deposit(user, createTransactionDto);
      expect(result).toEqual({ message: 'ok' });
    });
  });
});
