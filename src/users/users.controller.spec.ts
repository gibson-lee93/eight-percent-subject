import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SigninDto } from './dto/signin.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    const createUser = {
      user_id: 'test',
      password: '1234',
    };

    it('회원가입 성공', async () => {
      const user = new User();
      user.id = 1;
      user.user_id = 'test';
      user.deletedAt = null;
      user.loginedAt = null;
      user.createdAt = new Date();
      user.updatedAt = new Date();
      jest.spyOn(service, 'createUser').mockResolvedValue(user);

      const result = await controller.createUser(createUser);
      expect(result).toEqual(user);
    });

    it('회원가입 실패: 이미 존재하는 이메일', async () => {
      jest.spyOn(service, 'createUser').mockImplementation(() => {
        throw new ConflictException('이미 가입된 이메일입니다.');
      });
      try {
        await controller.createUser(createUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('이미 가입된 이메일입니다.');
      }
    });
  });

  describe('signIn', () => {
    const body = {
      user_id: 'test',
      password: '1234',
    };
    const signinDto = new SigninDto();
    signinDto.user_id = body.user_id;
    signinDto.password = body.password;

    it('로그인 성공', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'TOKEN' });

      const result = await controller.signIn(signinDto);
      expect(result).toEqual({ accessToken: 'TOKEN' });
    });

    it('로그인 실패 ', async () => {
      jest.spyOn(service, 'signIn').mockImplementation(() => {
        throw new UnauthorizedException('login fail');
      });
      try {
        await controller.createUser(signinDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('login fail');
      }
    });
  });

  describe('signOut', () => {
    const user = new User();
    user.id = 1;
    user.user_id = 'test';

    it('로그아웃 성공', async () => {
      jest
        .spyOn(service, 'signOut')
        .mockResolvedValue({ message: '로그아웃 완료' });

      const result = await controller.signOut(user);
      expect(result).toEqual({ message: '로그아웃 완료' });
    });

    it('로그아웃 실패: 존재하지 않는 아이디', async () => {
      jest.spyOn(service, 'signOut').mockImplementation(() => {
        throw new NotFoundException('유효한 아이디가 아닙니다.');
      });
      try {
        await controller.signOut(user);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('유효한 아이디가 아닙니다.');
      }
    });
  });
});
