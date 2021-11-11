import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from 'typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
