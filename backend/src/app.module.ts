import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { resolve } from 'path'
import { OBSModule } from './obs/_.module'
import { WoWModule } from './wow/module'
import { MusicModule } from './music/music.module'
import { ConfigModule } from '@nestjs/config'
import { TwitchModule } from './twitch/module'
import { StreamModule } from './stream/module'
import { GraphQLLoggingPlugin } from './common/graphql-logging.plugin'

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
      subscriptions: {
        'graphql-ws': true,
      },
      plugins: [new GraphQLLoggingPlugin()],
    }),
    OBSModule,
    MusicModule,
    TwitchModule,
    StreamModule,
    WoWModule,
  ],
})
export class AppModule {}
