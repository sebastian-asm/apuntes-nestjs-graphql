import { ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'

import { ItemsService } from './items.service'
import { Item } from './entities/item.entity'
import { CreateItemInput } from './dto/inputs/create-item.input'
import { UpdateItemInput } from './dto/inputs/update-item.input'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { PaginationArgs } from 'src/common/dtos/args/pagination.arg'
import { SearchArgs } from 'src/common/dtos/args/search.arg'

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  createItem(@Args('createItemInput') createItemInput: CreateItemInput, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.create(createItemInput, user)
  }

  @Query(() => [Item], { name: 'items' })
  findAll(@CurrentUser() user: User, @Args() pagination: PaginationArgs, @Args() search: SearchArgs): Promise<Item[]> {
    return this.itemsService.findAll(user, pagination, search)
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.findOne(id, user)
  }

  @Mutation(() => Item, { name: 'updateItem' })
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user)
  }

  @Mutation(() => Item, { name: 'removeItem' })
  removeItem(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.remove(id, user)
  }
}
