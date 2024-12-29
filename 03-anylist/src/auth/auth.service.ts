import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'

import { AuthResponse } from './types/auth-response.type'
import { RegisterInput } from './dto/inputs/register.input'
import { UsersService } from 'src/users/users.service'
import { LoginInput } from './dto/inputs/login.input'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  private getJwtToken(id: string): string {
    return this.jwtService.sign({ id })
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const user = await this.usersService.create(registerInput)
    const token = this.getJwtToken(user.id)
    return { user, token }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput
    const user = await this.usersService.findOneByEmail(email)
    if (!compareSync(password, user.password)) throw new BadRequestException('Las credenciales no son válidas')
    const token = this.getJwtToken(user.id)
    return { user, token }
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id)
    if (!user.isActive) throw new UnauthorizedException('El usuario no está activo')
    delete user.password
    return user
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id)
    return { token, user }
  }
}
