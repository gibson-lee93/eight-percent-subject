import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-guard/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAllAccounts(@GetUser() user: User): Promise<Account[]> {
    return this.accountsService.findAllAccounts(user);
  }

  @Get('/:id')
  findOneAccount(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Account> {
    return this.accountsService.findOneAccount(+id, user);
  }

  @Post()
  createAccount(
    @Body() createAccountDto: CreateAccountDto,
    @GetUser() user: User,
  ): Promise<Account> {
    return this.accountsService.createAccount(createAccountDto, user);
  }

  @Patch('/:id')
  updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @GetUser() user: User,
  ): Promise<Account> {
    return this.accountsService.updateAccount(+id, updateAccountDto, user);
  }

  @Delete('/:id')
  deleteAccount(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.accountsService.deleteAccount(+id, user);
  }
}
