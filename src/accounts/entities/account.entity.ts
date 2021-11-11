import { CoreEntity } from '../../core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Entity()
export class Account extends CoreEntity {
  @Column()
  acc_num: string;

  @Column()
  money: number;

  @OneToMany((_type) => Transaction, (transaction) => transaction.account, {
    eager: true,
  })
  transactions: Transaction[];
}
