import { Injectable, NotFoundException } from '@nestjs/common'

import { Todo } from './entity/todo.entity'
import { CreateTodoInput } from './dtos/inputs/create.input'
import { UpdateTodoInput } from './dtos/inputs/update.input'

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Buy milk', done: false },
    { id: 2, description: 'Buy bread', done: false },
    { id: 3, description: 'Buy cheese', done: true }
  ]

  findAll(): Todo[] {
    return this.todos
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id)
    if (!todo) throw new NotFoundException('La tarea no existe')
    return todo
  }

  create(createTodoInput: CreateTodoInput): Todo {
    const todo = new Todo()
    todo.description = createTodoInput.description
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1
    this.todos.push(todo)
    return todo
  }

  update(updateTodoInput: UpdateTodoInput): Todo {
    const { id, description, done } = updateTodoInput
    const todoToUpdate = this.findOne(id)
    if (description) todoToUpdate.description = description
    if (done !== undefined) todoToUpdate.done = done
    this.todos = this.todos.map((todo) => (todo.id === id ? todoToUpdate : todo))
    return todoToUpdate
  }

  delete(id: number): boolean {
    const todoToDelete = this.findOne(id)
    this.todos = this.todos.filter((todo) => todo.id !== todoToDelete.id)
    return true
  }
}
