import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsNotEmpty()
  password: string
}
