import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInputs } from './dto/inputs/create-todo.input';
import { UpdateTodoInputs } from './dto/inputs/update-todo.input';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del alma', done: true },
    { id: 2, description: 'Piedra del tiempo', done: false },
    { id: 3, description: 'Piedra del espacio', done: true },
  ];

  get totalTodos(): number {
    return this.todos.length;
  }

  get completedTodos(): number {
    return this.todos.filter((todo) => todo.done).length;
  }

  get pendingTodos(): number {
    return this.todos.filter((todo) => !todo.done).length;
  }

  findAll({ status }: StatusArgs): Todo[] {
    if (status !== undefined) {
      const filteredTodo = this.todos.filter((todo) => todo.done === status);
      return filteredTodo;
    }
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

  update({ id, description, done }: UpdateTodoInputs): Todo {
    const todoToUpdate = this.finOne(id);

    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map((todo) => {
      if (todo.id === id) return todoToUpdate;
      return todo;
    });

    return todoToUpdate;
  }

  remove(id: number): boolean {
    this.finOne(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return true;
  }
}
