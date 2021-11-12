import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AccountsRepository } from './accounts.repository';
import { Account } from './entities/account.entity';

const mockUser = new User();
mockUser.id = 1;
mockUser.user_id = 'testuser';

describe('TransactionService', () => {
  let accountsRepository: AccountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsRepository],
    }).compile();

    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(accountsRepository).toBeDefined();
  });

  describe('findOneAccount', () => {
    it('계좌 조회에 성공한다', async () => {
      const id = 1;
      const acc_num = '0123456789';
      const account = new Account();
      account.id = id;
      account.acc_num = acc_num;
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(account);

      const expectAccount = await accountsRepository.findOneAccount(
        id,
        mockUser,
      );

      expect(expectAccount).toMatchObject(account);
    });

    it('해당 계좌가 존재하지 않아 조회에 실패한다', async () => {
      expect.assertions(2);
      const id = 1;
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(undefined);

      try {
        const expectAccount = await accountsRepository.findOneAccount(
          id,
          mockUser,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('해당 계좌가 존재하지 않습니다');
      }
    });
  });

  describe('findOneByAccountNumber', () => {
    it('계좌 조회에 성공한다', async () => {
      const id = 1;
      const acc_num = '0123456789';
      const account = new Account();
      account.id = id;
      account.acc_num = acc_num;
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(account);

      const expectAccount = await accountsRepository.findOneByAccountNumber(
        acc_num,
        mockUser,
      );

      expect(expectAccount).toMatchObject(account);
    });

    it('해당 계좌가 존재하지 않아 조회에 실패한다', async () => {
      expect.assertions(2);
      const acc_num = '0123456789';
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(undefined);

      try {
        const expectAccount = await accountsRepository.findOneByAccountNumber(
          acc_num,
          mockUser,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('해당 계좌가 존재하지 않습니다');
      }
    });
  });

  describe('updateAccount', () => {
    it('계좌 수정에 성공한다', async () => {
      const id = 1;
      const money = 100;
      const updateAccountDto = { money };

      const acc_num = '0123456789';
      const account = new Account();
      account.id = id;
      account.acc_num = acc_num;
      account.money = 0;
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(account);

      account.money = money;
      jest
        .spyOn(accountsRepository, 'updateAccount')
        .mockResolvedValue(account);

      const expectAccount = await accountsRepository.updateAccount(
        id,
        updateAccountDto,
        mockUser,
      );

      expect(expectAccount).toMatchObject(account);
    });

    it('수정을 위한 입력값이 존재하지 않아 수정에 실패한다', async () => {
      expect.assertions(2);
      const id = 1;
      const updateAccountDto = Object();

      try {
        const expectAccount = await accountsRepository.updateAccount(
          id,
          updateAccountDto,
          mockUser,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('요청 값이 잘못되었습니다');
      }
    });
  });
});
