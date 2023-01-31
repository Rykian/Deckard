import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PluginDefinition } from 'apollo-server-core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import apolloLogger from 'src/apollo-logger';
import { resolve } from 'path';
import { OBSModule } from './obs/_.module';
import { WoWModule } from './wow/module';
import { plugin as ApolloTracing } from 'apollo-tracing';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: resolve('..', 'schema.graphql'),
      installSubscriptionHandlers: true,
      plugins: [ApolloTracing() as PluginDefinition, apolloLogger],
    }),
    OBSModule,
    WoWModule,
  ],
})
export class AppModule {}
