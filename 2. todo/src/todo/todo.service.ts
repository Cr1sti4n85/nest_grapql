import { Injectable } from '@nestjs/common';
import { Todo } from './entity/todo.entity';

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
}
