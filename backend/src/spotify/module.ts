import { Module } from '@nestjs/common'
import { EnvironmentModule } from 'src/env.module'
import { PubSubModule } from 'src/pubsub.module'
import { RedisModule } from 'src/redis.module'
import { SpotifyResolver } from './resolver'
import { SpotifyTrackService } from './track.service'

@Module({
  imports: [EnvironmentModule, RedisModule, PubSubModule],
  providers: [SpotifyTrackService, SpotifyResolver],
})
export class SpotifyModule {}
