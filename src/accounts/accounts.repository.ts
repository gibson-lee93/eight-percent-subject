import { User } from '../users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async findAllAccounts(user: User): Promise<Account[]> {
    return await this.find({ user });
  }

  async findOneAccount(id: number, user: User): Promise<Account> {
    const existedAccount = await this.findOne({ id, user });
    if (!existedAccount) {
      throw new NotFoundException('해당 계좌가 존재하지 않습니다');
    }
    return existedAccount;
  }

  async findOneByAccountNumber(acc_num: string, user: User): Promise<Account> {
    const existedAccount = await this.findOne({ acc_num, user });
    if (!existedAccount) {
      throw new NotFoundException('해당 계좌가 존재하지 않습니다');
    }
    return existedAccount;
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
    return await this.save(account);
  }
}
