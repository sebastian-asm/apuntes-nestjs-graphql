import { ArgsType, Field } from '@nestjs/graphql'
import { IsArray } from 'class-validator'

import { ValidRoles } from 'src/auth/enums/valid-roles.enum'

@ArgsType()
export class ValidRolesArgs {
  // para evitar un error con el tipo de dato enum (validRoles) hay que "registrarlo" en graphql
  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  roles: ValidRoles[] = []
}
