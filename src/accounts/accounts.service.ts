import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async updateAccount(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    if (Object.keys(updateAccountDto).length === 0) {
      throw new BadRequestException('요청 값이 잘못되었습니다');
    }
    const account = await this.findOneAccount(id);
    account.money = updateAccountDto.money;
    return await this.accountsRepository.save(account);
  }
}
