import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    //crear user
    const user = await this.usersService.create(signupInput);

    //create jwt
    const token = this.jwtService.sign({
      id: user.id,
    });

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!(await compare(loginInput.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    //create jwt
    const token = this.jwtService.sign({
      id: user.id,
    });

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (user.isBlocked) {
      throw new UnauthorizedException('User is inactive');
    }
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //create jwt
    const token = this.jwtService.sign({
      id: user.id,
    });

    return {
      token,
      user,
    };
  }
}
