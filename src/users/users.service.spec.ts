import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
jest.mock('../auth/auth.service');

const mockUser = new User();
mockUser.id = 1;
mockUser.user_id = 'test';
mockUser.deletedAt = null;
mockUser.loginedAt = null;
mockUser.createdAt = new Date();
mockUser.updatedAt = new Date();

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('유저 생성 성공', async () => {
      expect.assertions(1);
      const createUser: CreateUserDto = {
        user_id: 'test',
        password: '123',
      };
      userRepository.save.mockResolvedValue(mockUser);
      const result = await service.createUser(createUser);
      expect(result).toBe(mockUser);
    });
    it('이미 존재하는 이메일', async () => {
      expect.assertions(3);
      const createUser: CreateUserDto = {
        user_id: 'test',
        password: '123',
      };
      userRepository.findOne.mockResolvedValue(mockUser);
      try {
        await service.createUser(createUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.status).toBe(409);
        expect(error.message).toBe('이미 가입된 이메일입니다.');
      }
    });
  });

  describe('signIn', () => {
    const signinDto: SigninDto = {
      user_id: 'test',
      password: '123',
    };
    it('로그인 성공', async () => {
      expect.assertions(1);
      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      userRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'jwtSign')
        .mockReturnValue({ accessToken: 'TOKEN' });
      const result = await service.signIn(signinDto);
      expect(result).toMatchObject({ accessToken: 'TOKEN' });
    });
    it('로그인 실패 : 없는 유저', async () => {
      expect.assertions(3);
      userRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.signIn(signinDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.status).toBe(401);
        expect(error.message).toBe('login fail');
      }
    });
    it('로그인 실패 : 비밀번호 미일치', async () => {
      expect.assertions(3);
      userRepository.findOne.mockResolvedValue(mockUser);
      const bcryptCompare = jest.fn().mockResolvedValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      try {
        await service.signIn(signinDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.status).toBe(401);
        expect(error.message).toBe('login fail');
      }
    });
  });

  describe('findOneByUserId', () => {
    it('유저 조회 성공', async () => {
      expect.assertions(1);
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOneByUserId('test');
      expect(result).toBe(mockUser);
    });
    it('유저 조회 실패 ', async () => {
      expect.assertions(3);
      userRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.findOneByUserId('test');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.status).toBe(404);
        expect(error.message).toBe('유효한 아이디가 아닙니다.');
      }
    });
  });

  describe('signOut', () => {
    it('로그아웃 성공', async () => {
      expect.assertions(1);
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.signOut(mockUser);
      expect(result.message).toBe('로그아웃 완료');
    });

    it('로그아웃 실패 : 유저 조회 실패', async () => {
      expect.assertions(3);
      userRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.signOut(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.status).toBe(404);
        expect(error.message).toBe('유효한 아이디가 아닙니다.');
      }
    });
  });
});
