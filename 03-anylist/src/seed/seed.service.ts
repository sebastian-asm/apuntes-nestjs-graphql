import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Item } from 'src/items/entities/item.entity'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { ItemsService } from 'src/items/items.service'
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data'
import { ListItem } from 'src/list-item/entities/list-item.entity'
import { List } from 'src/lists/entities/list.entity'
import { ListsService } from 'src/lists/lists.service'
import { ListItemService } from 'src/list-item/list-item.service'

@Injectable()
export class SeedService {
  private isProd: boolean

  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ListItem) private readonly listItemRespository: Repository<ListItem>,
    @InjectRepository(List) private readonly listRespository: Repository<List>,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService
  ) {
    this.isProd = this.configService.get('STATE') === 'production'
  }

  async seed(): Promise<boolean> {
    if (this.isProd) throw new UnauthorizedException('No disponible en producción')
    await this.resetDatabase()
    const user = await this.loadUsers()
    await this.loadItems(user)
    const list = await this.loadLists(user)
    const items = await this.itemsService.findAll(user, { limit: 15 }, {})
    this.loadListItems(list, items)
    return true
  }

  async resetDatabase(): Promise<void> {
    await this.listItemRespository.delete({})
    await this.listRespository.delete({})
    await this.itemsRepository.delete({})
    await this.userRepository.delete({})
  }

  async loadUsers(): Promise<User> {
    const users = []
    for (const user of SEED_USERS) users.push(await this.usersService.create(user))
    return users[0]
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = []
    for (const item of SEED_ITEMS) itemsPromises.push(this.itemsService.create(item, user))
    await Promise.all(itemsPromises)
  }

  async loadLists(user: User): Promise<List> {
    const lists = []
    for (const list of SEED_LISTS) lists.push(await this.listsService.create(list, user))
    return lists[0]
  }

  loadListItems(list: List, items: Item[]): void {
    for (const item of items) {
      this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id
      })
    }
  }
}
