import { Module } from '@nestjs/common'
import { EnvironmentModule } from 'src/env.module'
import { OBSModule } from 'src/obs/_.module'
import { PubSubModule } from 'src/pubsub.module'
import { RedisModule } from 'src/redis.module'
import { TunnelModule } from 'src/tunnel'
import { TwitchEventService } from './event.service'
import { TwitchRedirectController } from './redirect.controller'
import { TwitchResolver } from './resolver'
import { TwitchService } from './service'

@Module({
  providers: [TwitchService, TwitchResolver, TwitchEventService],
  controllers: [TwitchRedirectController],
  imports: [
    RedisModule,
    PubSubModule,
    EnvironmentModule,
    OBSModule,
    TunnelModule,
  ],
  exports: [TwitchService],
})
export class TwitchModule {}
