import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/auth-guard/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('/signin')
  signIn(@Body() signinDto: SigninDto): Promise<{ accessToken }> {
    return this.usersService.signIn(signinDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/signout')
  signOut(@GetUser() user: User): Promise<{ message: string }> {
    return this.usersService.signOut(user);
  }
}
