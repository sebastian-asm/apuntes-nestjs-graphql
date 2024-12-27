import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateItemInput } from './dto/inputs/create-item.input'
import { UpdateItemInput } from './dto/inputs/update-item.input'
import { Item } from './entities/item.entity'

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRespository: Repository<Item>
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRespository.create(createItemInput)
    return await this.itemsRespository.save(newItem)
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRespository.find()
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRespository.findOneBy({ id })
    if (!item) throw new NotFoundException('El item no existe')
    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.findOne(id)
    return await this.itemsRespository.save({ ...item, ...updateItemInput })
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id)
    await this.itemsRespository.remove(item)
    return { ...item, id }
  }
}
