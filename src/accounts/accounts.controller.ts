import { Controller, Post, Get, Param, Body, Delete, Patch } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
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

  @Patch('/:id')
  updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountsService.updateAccount(+id, updateAccountDto);
  }

  @Delete('/:id')
  deleteAccount(@Param('id') id: string): Promise<{ message: string }> {
    return this.accountsService.deleteAccount(+id);
  }
}
