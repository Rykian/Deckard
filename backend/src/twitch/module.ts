import { Module } from '@nestjs/common';
import { EnvironmentModule } from 'src/env.module';
import { PubSubModule } from 'src/pubsub.module';
import { RedisModule } from 'src/redis.module';
import { TwitchResolver } from './resolver';
import { TwitchService } from './service';

@Module({
  providers: [TwitchService, TwitchResolver],
  imports: [RedisModule, PubSubModule, EnvironmentModule],
})
export class TwitchModule {}
