import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { User } from 'src/users/entities/user.entity'
import { ListItem } from 'src/list-item/entities/list-item.entity'

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column()
  @Field(() => String)
  name: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index()
  @Field(() => User)
  user: User

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[]
}
