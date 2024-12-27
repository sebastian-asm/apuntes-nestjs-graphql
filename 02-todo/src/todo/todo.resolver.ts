import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql'

import { Todo } from './entity/todo.entity'
import { TodoService } from './todo.service'
import { CreateTodoInput } from './dtos/inputs/create.input'
import { UpdateTodoInput } from './dtos/inputs/update.input'
import { StatusArgs } from './dtos/args/status.arg'

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos' })
  findAll(@Args() statusArgs: StatusArgs): Todo[] {
    return this.todoService.findAll(statusArgs)
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => Int }) id: number): Todo {
    return this.todoService.findOne(id)
  }

  @Mutation(() => Todo, { name: 'createTodo' })
  create(@Args('createTodoInput') createTodoInput: CreateTodoInput) {
    return this.todoService.create(createTodoInput)
  }

  @Mutation(() => Todo, { name: 'updateTodo' })
  update(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput)
  }

  @Mutation(() => Boolean, { name: 'deleteTodo' })
  delete(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.delete(id)
  }

  @Query(() => Int, { name: 'countTodosByStatus' })
  countTodosByStatus(@Args() statusArgs: StatusArgs): number {
    return this.todoService.findAll(statusArgs).length
  }
}
