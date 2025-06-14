import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInputs } from './dto/inputs/create-todo.input';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del alma' },
    { id: 2, description: 'Piedra del tiempo' },
    { id: 3, description: 'Piedra del espacio' },
  ];

  findAll(): Todo[] {
    return this.todos;
  }

  finOne(id: number): Todo {
    const todo: Todo | undefined = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  create(createTodoInput: CreateTodoInputs): Todo {
    const todo = new Todo();
    todo.description = createTodoInput.description;
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1;
    this.todos.push(todo);
    return todo;
  }
}
