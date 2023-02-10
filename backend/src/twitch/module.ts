import { Module } from '@nestjs/common'
import { EnvironmentModule } from 'src/env.module'
import { PubSubModule } from 'src/pubsub.module'
import { RedisModule } from 'src/redis.module'
import { TwitchEventService } from './event.service'
import { TwitchResolver } from './resolver'
import { TwitchService } from './service'

@Module({
  providers: [TwitchService, TwitchResolver, TwitchEventService],
  imports: [RedisModule, PubSubModule, EnvironmentModule],
  exports: [TwitchService],
})
export class TwitchModule {}
