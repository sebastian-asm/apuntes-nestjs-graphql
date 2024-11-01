import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class DemoResolver {
  // se tiene que indicar a graphql lo que devuelve, en este caso un string
  @Query(
    () => String,
    // generando la documentación
    { description: 'Este será un mensaje de prueba', name: 'demo' }
  )
  demoMessage(): string {
    return 'Mensaje de prueba'
  }

  @Query(() => Float, { name: 'randomNumber' })
  getRandomNumber(): number {
    return Math.random() * 100
  }

  @Query(() => Int, { name: 'randomFromZeroTo' })
  // con @Args indicamos que recibe un parámetro
  // se indica la clase de dato a recibir y que puede ser null
  getRandomFromZeroTo(@Args('to', { type: () => Int, nullable: true }) to: number = 10): number {
    return Math.floor(Math.random() * to)
  }
}
