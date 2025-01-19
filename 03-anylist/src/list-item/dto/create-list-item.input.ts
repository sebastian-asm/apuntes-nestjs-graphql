import { InputType, Field, ID } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator'

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity: number = 0

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false

  @Field(() => ID)
  @IsUUID()
  listId: string

  @Field(() => ID)
  @IsUUID()
  itemId: string
}
