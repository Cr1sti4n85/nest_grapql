import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './args/roles.arg';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  //Args ya no necesita nombre entre parentesis porque lo toma de ValidRolesArgs
  findAll(@Args() validRoles: ValidRolesArgs): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.block(id);
  }
}
