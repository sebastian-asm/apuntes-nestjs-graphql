import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hashSync } from 'bcrypt'

import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './entities/user.entity'
import { RegisterInput } from 'src/auth/dto/inputs/register.input'
import { ValidRoles } from 'src/auth/enums/valid-roles.enum'

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(registerInput: RegisterInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...registerInput,
        password: hashSync(registerInput.password, 10)
      })
      return await this.userRepository.save(newUser)
    } catch (error) {
      this.handleErrors(error)
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return await this.userRepository.find()
    return await this.userRepository
      .createQueryBuilder()
      .where('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany()
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch {
      throw new BadRequestException('Las credenciales no son válidas')
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch {
      throw new BadRequestException('El usuario no existe')
    }
  }

  block(id: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  // never indica que no retorna ningún valor
  private handleErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException('Error al realizar el registro')
    this.logger.error(error)
    throw new InternalServerErrorException('Hubo un error inesperado')
  }
}
