import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.usersRepository.findOne({
      where: {
        user_id: createUserDto.user_id,
      },
    });

    if (checkUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const user = this.usersRepository.create(createUserDto);
    try {
      const result = await this.usersRepository.save(user);
      delete result.password;
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        '회원 가입에 오류가 발생하였습니다.',
      );
    }
  }

  async signIn(signinDto: SigninDto): Promise<{ accessToken: string }> {
    const { user_id, password } = signinDto;
    const user = await this.usersRepository.findOne({ user_id });

    if (user && (await bcrypt.compare(password, user.password))) {
      const loginedAt = new Date();
      user.loginedAt = loginedAt;
      await this.usersRepository.save(user);
      return this.authService.jwtSign(user);
    } else {
      throw new UnauthorizedException('login fail');
    }
  }

  async findOneByUserId(user_id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ user_id });
    if (!user) {
      throw new NotFoundException('유효한 아이디가 아닙니다.');
    }
    return user;
  }
}
