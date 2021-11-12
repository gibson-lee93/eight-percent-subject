import { CoreEntity } from '../../core/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Account extends CoreEntity {
  @Column({ unique: true })
  acc_num: string;

  @Column({ default: 0 })
  money: number;

  @ManyToOne((_type) => User, (user) => user.accounts, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
