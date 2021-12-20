import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AccountsRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
  ) {}

  findAllAccounts(user: User): Promise<Account[]> {
    return this.accountsRepository.findAllAccounts(user);
  }

  findOneAccount(id: number, user: User): Promise<Account> {
    return this.accountsRepository.findOneAccount(id, user);
  }

  findOneByAccountNumber(acc_num: string, user: User): Promise<Account> {
    return this.accountsRepository.findOneByAccountNumber(acc_num, user);
  }

  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
  ): Promise<Account> {
    const existedAccount = await this.findOneByAccountNumber(
      createAccountDto.acc_num,
      user,
    );
    if (existedAccount) {
      throw new ConflictException('이미 사용 중인 계좌번호입니다');
    }
    return await this.accountsRepository.save({ ...createAccountDto, user });
  }

  updateAccount(
    id: number,
    updateAccountDto: UpdateAccountDto,
    user: User,
  ): Promise<Account> {
    return this.accountsRepository.updateAccount(id, updateAccountDto, user);
  }

  async deleteAccount(id: number, user: User): Promise<{ message: string }> {
    await this.findOneAccount(id, user);
    await this.accountsRepository.softDelete({ id });
    return { message: '계좌 삭제 완료' };
  }
}
