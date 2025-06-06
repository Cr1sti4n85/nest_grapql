import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  //primer query, en elquery le digo lo que devuelve
  @Query(() => String)
  helloWorld(): string {
    return 'Hola mundo';
  }
}
