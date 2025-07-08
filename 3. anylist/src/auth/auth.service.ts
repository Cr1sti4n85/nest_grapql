import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Assuming UsersService is imported from the correct path
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    console.log(signupInput);

    //crear user
    const user = await this.usersService.create(signupInput);

    //create jwt
    const token = 'abc123';

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const token = 'abc123';
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!(await compare(loginInput.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      token,
      user,
    };
  }
}
