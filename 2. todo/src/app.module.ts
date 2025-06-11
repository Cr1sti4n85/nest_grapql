import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // graphiql: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // plugins: [ApolloServer],
    }),
    HelloWorldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
