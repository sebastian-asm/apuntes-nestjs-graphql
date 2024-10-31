import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { Todo } from './entities/todo.entity'

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Tarea 1', done: false },
    { id: 2, description: 'Tarea 2', done: false },
    { id: 3, description: 'Tarea 3', done: true }
  ]

  create(createTodoDto: CreateTodoDto): Todo {
    const { description } = createTodoDto
    const todo = new Todo()
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1
    todo.description = description
    this.todos.push(todo)
    return todo
  }

  findAll(): Todo[] {
    return this.todos
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id)
    if (!todo) throw new NotFoundException('Tarea no encontrada')
    return todo
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const { description, done } = updateTodoDto
    const todo = this.findOne(id)
    if (description) todo.description = description
    if (done !== undefined) todo.done = done
    this.todos.map((dbTodo) => (dbTodo.id === id ? todo : dbTodo))
    return todo
  }

  remove(id: number) {
    this.findOne(id)
    this.todos = this.todos.filter((todo) => todo.id !== id)
  }
}
