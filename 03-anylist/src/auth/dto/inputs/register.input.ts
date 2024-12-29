import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsNotEmpty()
  password: string

  @Field(() => String)
  @IsNotEmpty()
  fullName: string
}
