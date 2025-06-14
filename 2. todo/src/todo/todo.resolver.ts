import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInputs } from './dto/inputs/create-todo.input';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos' })
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => Int }) id: number): Todo {
    return this.todoService.finOne(id);
  }

  @Mutation(() => Todo, { name: 'createTodos' })
  createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInputs): Todo {
    return this.todoService.create(createTodoInput);
  }

  updateTodo() {}

  removeTodo() {}
}
