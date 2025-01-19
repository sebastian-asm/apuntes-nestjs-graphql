import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsBoolean, IsPositive, IsUUID } from 'class-validator'

import { List } from 'src/lists/entities/list.entity'
import { Item } from 'src/items/entities/item.entity'

@Entity('listItems')
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @IsUUID()
  id: string

  @Column({ type: 'numeric' })
  @Field(() => Number)
  @IsPositive()
  quantity: number

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  @IsBoolean()
  completed: boolean

  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List)
  list: List

  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item
}
