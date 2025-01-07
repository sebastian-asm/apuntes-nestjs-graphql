import { ArgsType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@ArgsType()
export class SearchArgs {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  query?: string
}
