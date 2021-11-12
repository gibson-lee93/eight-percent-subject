import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAllAccounts(user: User): Promise<Account[]> {
    return await this.accountsRepository.find({ user });
  }

  async findOneAccount(id: number, user: User): Promise<Account> {
    const existedAccount = await this.accountsRepository.findOne({ id, user });
    if (!existedAccount) {
      throw new NotFoundException('해당 계좌가 존재하지 않습니다');
    }
    return existedAccount;
  }

  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
  ): Promise<Account> {
    const existedAccount = await this.accountsRepository.findOne({
      ...createAccountDto,
    });
    if (existedAccount) {
      throw new ConflictException('이미 사용 중인 계좌번호입니다');
    }
    return await this.accountsRepository.save({ ...createAccountDto, user });
  }

  async updateAccount(
    id: number,
    updateAccountDto: UpdateAccountDto,
    user: User,
  ): Promise<Account> {
    if (Object.keys(updateAccountDto).length === 0) {
      throw new BadRequestException('요청 값이 잘못되었습니다');
    }
    const account = await this.findOneAccount(id, user);
    account.money = updateAccountDto.money;
    return await this.accountsRepository.save(account);
  }

  async deleteAccount(id: number, user: User): Promise<{ message: string }> {
    await this.findOneAccount(id, user);
    await this.accountsRepository.softDelete({ id });
    return { message: '계좌 삭제 완료' };
  }
}
