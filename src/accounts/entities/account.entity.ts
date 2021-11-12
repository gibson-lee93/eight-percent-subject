import { CoreEntity } from '../../core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';

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
}
