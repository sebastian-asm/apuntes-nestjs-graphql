import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateItemInput } from './dto/inputs/create-item.input'
import { UpdateItemInput } from './dto/inputs/update-item.input'
import { Item } from './entities/item.entity'
import { User } from 'src/users/entities/user.entity'
import { PaginationArgs } from 'src/common/dtos/args/pagination.arg'
import { SearchArgs } from 'src/common/dtos/args/search.arg'

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRespository: Repository<Item>
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRespository.create({ ...createItemInput, user })
    return await this.itemsRespository.save(newItem)
  }

  async findAll(user: User, pagination: PaginationArgs, search: SearchArgs): Promise<Item[]> {
    const { id } = user
    const { limit, offset } = pagination
    console.log(search)
    return await this.itemsRespository.find({ take: limit, skip: offset, where: { user: { id } } })
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRespository.findOneBy({ id, user: { id: user.id } })
    if (!item) throw new NotFoundException('El item no existe')
    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    // versión 1
    // await this.findOne(id, user)
    // const item = await this.itemsRespository.preload(updateItemInput)
    // if (!item) throw new NotFoundException('El item no existe')
    // return await this.itemsRespository.save(item)

    // versión 2
    const item = await this.findOne(id, user)
    return await this.itemsRespository.save({ ...item, ...updateItemInput, user })
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user)
    await this.itemsRespository.remove(item)
    return { ...item, id }
  }

  async count(user: User): Promise<number> {
    return await this.itemsRespository.count({ where: { user: { id: user.id } } })
  }
}
