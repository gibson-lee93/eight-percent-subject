import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  jwtSign(user: User): { accessToken: string } {
    const payload = { user_id: user.user_id, loginedAt: user.loginedAt };
    return {
      accessToken : this.jwtService.sign(payload),
    };
  }
}
