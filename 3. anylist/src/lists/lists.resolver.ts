import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAllByUser(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOneByUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.listsService.remove(id, user);
  }
}
