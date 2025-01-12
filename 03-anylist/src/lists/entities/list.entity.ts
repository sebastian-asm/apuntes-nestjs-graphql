import { ObjectType, Field, ID } from '@nestjs/graphql'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from 'src/users/entities/user.entity'

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @IsUUID()
  id: string

  @Column()
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name: string

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User
}
