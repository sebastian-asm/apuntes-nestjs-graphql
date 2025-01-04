import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Item } from 'src/items/entities/item.entity'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { ItemsService } from 'src/items/items.service'
import { SEED_USERS, SEED_ITEMS } from './data/seed-data'

@Injectable()
export class SeedService {
  private isProd: boolean

  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService
  ) {
    this.isProd = this.configService.get('STATE') === 'production'
  }

  async seed(): Promise<boolean> {
    if (this.isProd) throw new UnauthorizedException('No disponible en producción')
    await this.resetDatabase()
    const user = await this.loadUsers()
    await this.loadItems(user)
    return true
  }

  async resetDatabase(): Promise<void> {
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
}
