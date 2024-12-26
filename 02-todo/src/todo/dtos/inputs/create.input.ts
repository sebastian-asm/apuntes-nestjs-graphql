import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'Descripción de la tarea' })
  @IsString()
  @IsNotEmpty()
  description: string
}
