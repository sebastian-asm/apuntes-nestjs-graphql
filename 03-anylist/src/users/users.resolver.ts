import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql'
import { ParseUUIDPipe, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { UpdateUserInput } from './dto/inputs/update-user.input'
import { ValidRolesArgs } from './dto/args/roles.arg'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { ValidRoles } from 'src/auth/enums/valid-roles.enum'
import { ItemsService } from 'src/items/items.service'
import { Item } from 'src/items/entities/item.entity'
import { PaginationArgs } from 'src/common/dtos/args/pagination.arg'
import { SearchArgs } from 'src/common/dtos/args/search.arg'
import { ListsService } from 'src/lists/lists.service'
import { List } from 'src/lists/entities/list.entity'

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(@Args() validRoles: ValidRolesArgs, @CurrentUser([ValidRoles.ADMIN]) user: User): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles)
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id)
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN]) userAdmin: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, userAdmin)
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user)
  }

  @ResolveField(() => Int, { name: 'itemsCount' }) // permite agregar un nuevo campo en la consulta
  // @Parent() permite acceder a los datos del objeto padre
  itemsCount(@Parent() user: User, @CurrentUser([ValidRoles.ADMIN]) userAdmin: User): Promise<number> {
    return this.itemsService.count(user)
  }

  @ResolveField(() => [Item], { name: 'items' })
  getItemsByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.ADMIN]) userAdmin: User,
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, pagination, search)
  }

  @ResolveField(() => Int, { name: 'listsCount' })
  listsCount(@Parent() user: User, @CurrentUser([ValidRoles.ADMIN]) userAdmin: User): Promise<number> {
    return this.listsService.count(user)
  }

  @ResolveField(() => [List], { name: 'lists' })
  getListsByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.ADMIN]) userAdmin: User,
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(user, pagination, search)
  }
}
