import { registerEnumType } from '@nestjs/graphql'

export enum ValidRoles {
  ADMIN = 'admin',
  USER = 'user'
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Roles válidos'
})
