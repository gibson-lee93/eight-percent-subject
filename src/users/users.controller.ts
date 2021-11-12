import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('/signin')
  signIn(@Body() signinDto: SigninDto): Promise<{ accessToken }> {
    return this.usersService.signIn(signinDto);
  }
}
