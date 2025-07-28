import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService, JwtService],
      useFactory: async (
        configService: ConfigService,
        jwtService: JwtService,
      ) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: configService.get('GRAPHQL_PLAYGROUND') === 'true',
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        //este context exige token siempre, si no se tiene un token entonces no se puede acceder a la info en graphql studio. Se puede usar cuando los endpoints de login y register están separados, como por ejemplo en una api rest.
        // context: ({ req }: { req: Request }) => {
        //   const token = req.headers.authorization?.replace('Bearer ', '')
        //     .trim();
        //   if (!token) {
        //     throw new Error('No token provided');
        //   }
        //   const payload = jwtService.decode(token);
        //   if (!payload || typeof payload !== 'object') {
        //     throw new Error('Invalid token');
        //   }
        // },
      }),
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    ItemsModule,

    UsersModule,

    AuthModule,

    SeedModule,

    CommonModule,

    ListsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
