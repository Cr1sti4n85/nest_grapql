import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  signup() {
    return this.authService.signup();
  }

  @Mutation()
  login() {
    return this.authService.login();
  }

  @Query()
  revalidateToken() {
    return this.authService.revalidateToken();
  }
}
