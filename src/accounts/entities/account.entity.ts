import { CoreEntity } from '../../core/entities/core.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Account extends CoreEntity {
  @Column({ unique: true })
  acc_num: string;

  @Column({ default: 0 })
  money: number;

  @OneToMany((_type) => Transaction, (transaction) => transaction.account, {
    eager: true,
  })
  transactions: Transaction[];

  @ManyToOne((_type) => User, (user) => user.accounts, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
