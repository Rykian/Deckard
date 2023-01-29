import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';
import { OBSModule } from './obs/_.module';
import { WoWModule } from './wow/module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: resolve('..', 'schema.graphql'),
      installSubscriptionHandlers: true,
    }),
    OBSModule,
  ],
})
export class AppModule {}
