import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async findOneByUserId(user_id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ user_id });
    if (!user) {
      throw new NotFoundException('유효한 아이디가 아닙니다.');
    }
    return user;
  }

  async createUser(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ message: string }> {
    const checkUser = await this.usersRepository.findOne({
      where: {
        user_id: userCredentialsDto.user_id,
      },
    });

    if (checkUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    try {
      const user = this.usersRepository.create(userCredentialsDto);
      await this.usersRepository.save(user);
      return { message: '회원가입이 완료되었습니다.' };
    } catch (error) {
      throw new InternalServerErrorException(
        '회원 가입에 오류가 발생하였습니다.',
      );
    }
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { user_id, password } = userCredentialsDto;
    const user = await this.usersRepository.findOne({ user_id });

    if (user && (await bcrypt.compare(password, user.password))) {
      const loginedAt = new Date();
      user.loginedAt = loginedAt;
    } else {
      throw new UnauthorizedException('login fail');
    }

    try {
      await this.usersRepository.save(user);
      return this.authService.jwtSign(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signOut(user: User): Promise<{ message: string }> {
    const userInfo = await this.findOneByUserId(user.user_id);
    userInfo.loginedAt = null;

    try {
      await this.usersRepository.save(userInfo);
      return { message: '로그아웃 완료' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
