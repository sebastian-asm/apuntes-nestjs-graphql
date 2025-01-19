import { Module } from '@nestjs/common'

import { SeedService } from './seed.service'
import { SeedResolver } from './seed.resolver'
import { UsersModule } from 'src/users/users.module'
import { ItemsModule } from 'src/items/items.module'
import { ListItemModule } from 'src/list-item/list-item.module'
import { ListsModule } from 'src/lists/lists.module'

@Module({
  providers: [SeedResolver, SeedService],
  imports: [UsersModule, ItemsModule, ListItemModule, ListsModule]
})
export class SeedModule {}
