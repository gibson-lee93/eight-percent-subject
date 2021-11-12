import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from '../../core/entities/core.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  user_id: string;

  @Column()
  password: string;

  @Column({ type: 'datetime', nullable: true })
  loginedAt: Date;

  @OneToMany((_type) => Account, (account) => account.user, {
    eager: true,
    cascade: true,
  })
  accounts: Account[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
