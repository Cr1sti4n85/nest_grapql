import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from '../users/users.service';

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
}
