import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/core/entities/core.entity';

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  user_id: string;

  @Column()
  password: string;

  @Column({ type: 'datetime', nullable: true })
  loginedAt: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
