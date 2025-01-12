import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Item } from 'src/items/entities/item.entity'
import { List } from 'src/lists/entities/list.entity'

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column()
  @Field(() => String)
  fullName: string

  @Column({ unique: true })
  @Field(() => String)
  email: string

  @Column()
  password: string

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String])
  roles: string[]

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean

  // lazy permite cargar la relación solo cuando se accede a ella
  // https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations
  @ManyToOne(() => User, (user) => user.lastUpdatedBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy?: User

  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  // @Field(() => [Item])
  items: Item[]

  @OneToMany(() => List, (list) => list.user)
  lists: List[]
}
