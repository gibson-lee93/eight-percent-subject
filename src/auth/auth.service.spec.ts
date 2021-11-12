import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: jest.fn(() => 'TOKEN') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect.assertions(2);
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('jwtSign', () => {
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.user_id = 'test';
    mockUser.deletedAt = null;
    mockUser.loginedAt = null;
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();

    it('토큰 발급 성공', () => {
      expect.assertions(1);
      jest.spyOn(jwtService, 'sign').mockReturnValue('TOKEN');
      const result = service.jwtSign(mockUser);
      expect(result).toMatchObject({ accessToken: 'TOKEN' });
    });
  });
});
