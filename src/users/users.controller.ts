import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/auth-guard/jwt-auth.guard';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ message: string }> {
    return this.usersService.createUser(userCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken }> {
    return this.usersService.signIn(userCredentialsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/signout')
  signOut(@GetUser() user: User): Promise<{ message: string }> {
    return this.usersService.signOut(user);
  }
}
