import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

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

  // 나중에 account테이블 생성되면 사용
  // @ManyToOne((_type) => Account, (account) => account.transactions, {
  //   eager: false,
  //   onDelete: 'CASCADE',
  // })
  // account: Account;
}