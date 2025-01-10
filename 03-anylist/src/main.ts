import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
      // si esta en true no permite usar mútiples @args() en los resolvers
      // forbidNonWhitelisted: true
    })
  )
  await app.listen(3000)
}
bootstrap()
