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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
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
  findAllAccounts(): Promise<Account[]> {
    return this.accountsService.findAllAccounts();
  }

  @Get('/:id')
  findOneAccount(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOneAccount(+id);
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
  ): Promise<Account> {
    return this.accountsService.updateAccount(+id, updateAccountDto);
  }

  @Delete('/:id')
  deleteAccount(@Param('id') id: string): Promise<{ message: string }> {
    return this.accountsService.deleteAccount(+id);
  }
}
