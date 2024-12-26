import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateTodoInput {
  @Field(() => Int)
  @IsInt()
  id: number

  @Field(() => String, { description: 'Descripción de la tarea', nullable: true })
  @IsString()
  @IsOptional()
  description?: string

  @Field(() => Boolean, { description: 'Estado de la tarea', nullable: true })
  @IsBoolean()
  @IsOptional()
  done?: boolean
}
