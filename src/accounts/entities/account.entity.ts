import { CoreEntity } from '../../core/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Account extends CoreEntity {
  @Column()
  acc_num: string;

  @Column()
  money: number;
}
