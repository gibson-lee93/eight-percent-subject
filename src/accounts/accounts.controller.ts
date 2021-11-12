import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAllAccounts(): Promise<Account[]> {
    return this.accountsService.findAllAccounts();
  }

  @Get('/:id')
  findOneAccount(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOneAccount(+id);
  }

  @Post()
  createAccount(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.createAccount(createAccountDto);
  }
}
