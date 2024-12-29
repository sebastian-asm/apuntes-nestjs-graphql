import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { ValidRoles } from '../enums/valid-roles.enum'
import { User } from 'src/users/entities/user.entity'

export const CurrentUser = createParamDecorator((roles: ValidRoles[] = [], context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context).getContext()
  const user: User = ctx.req.user
  if (!user) throw new InternalServerErrorException('Error en la sesión del usuario')
  if (roles.length === 0) return user
  for (const role of user.roles) if (roles.includes(role as ValidRoles)) return user
  throw new ForbiddenException('El usuario no tiene los permisos necesarios')
})
