import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';

const mockAccountsRepository = () => ({
  findAllAccounts: jest.fn(),
  findOne: jest.fn(),
  findOneAccount: jest.fn(),
  findOneByAccountNumber: jest.fn(),
  save: jest.fn(),
  updateAccount: jest.fn(),
  softDelete: jest.fn(),
});

const mockUser = new User();
mockUser.id = 1;
mockUser.user_id = 'testuser';

describe('TransactionService', () => {
  let service: AccountsService;
  let accountsRepository: AccountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: AccountsRepository,
          useFactory: mockAccountsRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect.assertions(2);
    expect(service).toBeDefined();
    expect(accountsRepository).toBeDefined();
  });

  describe('createAccount', () => {
    const acc_num = '0123456789';
    const createAccountDto = { acc_num };

    const account = new Account();
    account.id = 1;

    it('account 생성에 성공한다', async () => {
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(accountsRepository, 'save').mockResolvedValue(account);

      const expectAccount = await service.createAccount(
        createAccountDto,
        mockUser,
      );

      expect(expectAccount.id).toEqual(account.id);
    });

    it('계좌 번호가 중복되어 account 생성에 실패한다', async () => {
      expect.assertions(2);
      jest.spyOn(accountsRepository, 'findOne').mockResolvedValue(account);

      try {
        const expectAccount = await service.createAccount(
          createAccountDto,
          mockUser,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('이미 사용 중인 계좌번호입니다');
      }
    });
  });
});
