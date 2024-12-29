import { Mutation, Resolver, Query, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { AuthService } from './auth.service'
import { RegisterInput } from './dto/inputs/register.input'
import { AuthResponse } from './types/auth-response.type'
import { LoginInput } from './dto/inputs/login.input'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { ValidRoles } from './enums/valid-roles.enum'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'register' })
  register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput)
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput)
  }

  @Query(() => AuthResponse, { name: 'revalidateToken' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser([ValidRoles.ADMIN]) user: User): AuthResponse {
    return this.authService.revalidateToken(user)
  }
}
