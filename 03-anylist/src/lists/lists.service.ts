import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateListInput } from './dto/create-list.input'
import { UpdateListInput } from './dto/update-list.input'
import { List } from './entities/list.entity'
import { User } from 'src/users/entities/user.entity'
import { PaginationArgs } from 'src/common/dtos/args/pagination.arg'
import { SearchArgs } from 'src/common/dtos/args/search.arg'

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listsRepository.create({ ...createListInput, user })
    return await this.listsRepository.save(newList)
  }

  async findAll(user: User, pagination: PaginationArgs, search: SearchArgs): Promise<List[]> {
    const { id } = user
    const { limit, offset } = pagination
    const { query } = search
    const queryBuilder = this.listsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where('"userId" = :id', { id })
    if (query) queryBuilder.andWhere('LOWER(name) like :query', { query: `%${query.toLowerCase()}%` })
    return queryBuilder.getMany()
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({ id, user: { id: user.id } })
    if (!list) throw new NotFoundException('La lista no existe')
    return list
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    const list = await this.findOne(id, user)
    return await this.listsRepository.save({ ...list, ...updateListInput, user })
  }

  async remove(id: string, user: User): Promise<List> {
    const item = await this.findOne(id, user)
    await this.listsRepository.remove(item)
    return { ...item, id }
  }

  async count(user: User): Promise<number> {
    return await this.listsRepository.count({ where: { user: { id: user.id } } })
  }
}
