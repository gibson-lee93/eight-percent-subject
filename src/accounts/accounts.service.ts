import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
  ) {}

  async findAllAccounts(): Promise<Account[]> {
    return await this.accountsRepository.find();
  }

  async findOneAccount(id: number): Promise<Account> {
    const existedAccount = await this.accountsRepository.findOne({ id });
    if (!existedAccount) {
      throw new NotFoundException('해당 계좌가 존재하지 않습니다');
    }
    return existedAccount;
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    return await this.accountsRepository.save({ ...createAccountDto });
  }

  async deleteAccount(id: number): Promise<{ message: string }> {
    await this.findOneAccount(id);
    await this.accountsRepository.softDelete({ id });
    return { message: '계좌 삭제 완료' };
  }
}
