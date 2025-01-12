import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import 'dotenv/config'

import { ItemsModule } from './items/items.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { SeedModule } from './seed/seed.module'
import { CommonModule } from './common/common.module'
import { ListsModule } from './lists/lists.module'

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: +DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
