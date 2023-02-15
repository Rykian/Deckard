import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PluginDefinition } from 'apollo-server-core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import apolloLogger from 'src/apollo-logger';
import { resolve } from 'path';
import { OBSModule } from './obs/_.module';
import { WoWModule } from './wow/module';
import { plugin as ApolloTracing } from 'apollo-tracing';
import { SpotifyModule } from './spotify/module';
import { ConfigModule } from '@nestjs/config';
import { TwitchModule } from './twitch/module';
import { StreamModule } from './stream/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        `.env.local`,
        '.env',
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: resolve('..', 'schema.graphql'),
      installSubscriptionHandlers: true,
      plugins: [ApolloTracing() as PluginDefinition, apolloLogger],
    }),
    OBSModule,
    SpotifyModule,
    TwitchModule,
    StreamModule,
    WoWModule,
  ],
})
export class AppModule {}
