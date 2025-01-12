import { ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql'

import { ListsService } from './lists.service'
import { List } from './entities/list.entity'
import { CreateListInput } from './dto/create-list.input'
import { UpdateListInput } from './dto/update-list.input'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { PaginationArgs } from 'src/common/dtos/args/pagination.arg'
import { SearchArgs } from 'src/common/dtos/args/search.arg'

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List, { name: 'createList' })
  createList(@Args('createListInput') createListInput: CreateListInput, @CurrentUser() user: User): Promise<List> {
    return this.listsService.create(createListInput, user)
  }

  @Query(() => [List], { name: 'lists' })
  findAll(@CurrentUser() user: User, @Args() pagination: PaginationArgs, @Args() search: SearchArgs): Promise<List[]> {
    return this.listsService.findAll(user, pagination, search)
  }

  @Query(() => List, { name: 'list' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User): Promise<List> {
    return this.listsService.findOne(id, user)
  }

  @Mutation(() => List, { name: 'updateList' })
  updateList(@Args('updateListInput') updateListInput: UpdateListInput, @CurrentUser() user: User): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user)
  }

  @Mutation(() => List, { name: 'removeList' })
  removeList(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User): Promise<List> {
    return this.listsService.remove(id, user)
  }
}
