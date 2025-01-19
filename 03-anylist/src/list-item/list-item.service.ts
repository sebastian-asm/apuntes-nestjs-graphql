import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateListItemInput } from './dto/create-list-item.input'
import { UpdateListItemInput } from './dto/update-list-item.input'
import { ListItem } from './entities/list-item.entity'
import { List } from 'src/lists/entities/list.entity'
import { PaginationArgs } from 'src/common/dtos/args/pagination.arg'
import { SearchArgs } from 'src/common/dtos/args/search.arg'

@Injectable()
export class ListItemService {
  constructor(@InjectRepository(ListItem) private readonly listItemRepository: Repository<ListItem>) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput
    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    })
    await this.listItemRepository.save(newListItem)
    return this.findOne(newListItem.id)
  }

  async findAll(list: List, pagination: PaginationArgs, search: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = pagination
    const { query } = search
    const queryBuilder = this.listItemRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where('"listId" = :listId', { listId: list.id })
    if (query) queryBuilder.andWhere('LOWER(item.name) like :query', { query: `%${query.toLowerCase()}%` })
    return queryBuilder.getMany()
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id })
    if (!listItem) throw new NotFoundException('La lista de items no existe')
    return listItem
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput
    const queryBuilder = this.listItemRepository.createQueryBuilder().update().set(rest).where('id = :id', { id })
    if (listId) queryBuilder.set({ list: { id: listId } })
    if (itemId) queryBuilder.set({ item: { id: itemId } })
    await queryBuilder.execute()
    return this.findOne(id)
  }

  async count(list: List): Promise<number> {
    return this.listItemRepository.count({ where: { list: { id: list.id } } })
  }
}
