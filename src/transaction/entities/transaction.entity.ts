import { Account } from '../../accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  trans_type: string;

  @Column()
  amount: number;

  @Column({ default: '' })
  comments: string;

  @Column({ default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((_type) => Account, (account) => account.transactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  account: Account;
}
