import { Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  //primer query, en elquery le digo lo que devuelve
  @Query(() => String, {
    description: 'Retorna string de hola mundo',
    name: 'salutation',
  })
  helloWorld(): string {
    return 'Hola mundo';
  }

  @Query(() => Float, { name: 'randomNumber' })
  getRandomNumber(): number {
    return Math.random() * 100;
  }

  @Query(() => Int)
  getRandomFromZero(): number {
    return Math.floor(Math.random() * 10);
  }
}
