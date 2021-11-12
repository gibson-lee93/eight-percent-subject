import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';

jest.mock('./accounts.service');
jest.mock('../transaction/transaction.service');

const mockAccount = new Account();
mockAccount.id = 1;
mockAccount.acc_num = '123456';
mockAccount.money = 100000;

describe('AccountController', () => {
  let controller: AccountsController;
  let accountService: AccountsService;

  const mockUser = new User();
  mockUser.id = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountsService],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountService = module.get<AccountsService>(AccountsService);
  });

  it('Should be defined', () => {
    expect.assertions(2);
    expect(controller).toBeDefined();
    expect(accountService).toBeDefined();
  });

  describe('createAccount', () => {
    it('계좌를 생성한다', async () => {
      expect.assertions(2);
      const id = 1;
      const acc_num = '123456';
      const createAccountDto = { acc_num };

      jest
        .spyOn(accountService, 'createAccount')
        .mockResolvedValue(mockAccount);

      const expectAccount = await controller.createAccount(
        createAccountDto,
        mockUser,
      );

      expect(expectAccount.id).toEqual(id);
      expect(expectAccount.acc_num).toEqual(acc_num);
    });
  });

  describe('findOneAccounts', () => {
    it('계좌 목록 조회에 성공한다', async () => {
      const accountArr = [mockAccount];

      jest
        .spyOn(accountService, 'findAllAccounts')
        .mockResolvedValue(accountArr);

      const expectAccount = await controller.findAllAccounts(mockUser);
      expect(expectAccount[0]).toEqual(mockAccount);
    });
  });

  describe('findOneAccount', () => {
    it('계좌 상세 조회에 성공한다', async () => {
      expect.assertions(3);

      jest
        .spyOn(accountService, 'findOneAccount')
        .mockResolvedValue(mockAccount);

      const expectAccount = await controller.findOneAccount('1', mockUser);
      expect(expectAccount.id).toEqual(1);
      expect(expectAccount.acc_num).toEqual('123456');
      expect(expectAccount.money).toEqual(100000);
    });
  });

  describe('updateAccount', () => {
    it('계좌 수정에 성공한다', async () => {
      expect.assertions(3);
      const updateAccountDto = { money: 100000 };

      jest
        .spyOn(accountService, 'updateAccount')
        .mockResolvedValue(mockAccount);

      const expectAccount = await controller.updateAccount(
        '1',
        updateAccountDto,
        mockUser,
      );
      expect(expectAccount.id).toEqual(1);
      expect(expectAccount.acc_num).toEqual('123456');
      expect(expectAccount.money).toEqual(100000);
    });
  });

  describe('deleteAccount', () => {
    it('계좌 삭제에 성공한다', async () => {
      expect.assertions(1);
      const message = '계좌 삭제 완료';
      jest
        .spyOn(accountService, 'deleteAccount')
        .mockResolvedValue({ message });

      const expectAccount = await controller.deleteAccount('1', mockUser);
      expect(expectAccount).toEqual({ message });
    });
  });
});
