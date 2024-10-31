import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsOptional } from 'class-validator'

import { CreateTodoDto } from './create-todo.dto'

// PartialType extiende todas las propiedades que tenga el CreateTodoDto
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsBoolean()
  @IsOptional()
  done?: boolean
}
