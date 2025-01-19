import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { ParseUUIDPipe, UseGuards } from '@nestjs/common'

import { ListItemService } from './list-item.service'
import { ListItem } from './entities/list-item.entity'
import { CreateListItemInput } from './dto/create-list-item.input'
import { UpdateListItemInput } from './dto/update-list-item.input'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(@Args('createListItemInput') createListItemInput: CreateListItemInput): Promise<ListItem> {
    return this.listItemService.create(createListItemInput)
  }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<ListItem> {
    return this.listItemService.findOne(id)
  }

  @Mutation(() => ListItem)
  updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    return this.listItemService.update(updateListItemInput.id, updateListItemInput)
  }
}
