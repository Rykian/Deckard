import { Module } from '@nestjs/common'
import { RedisModule } from 'src/redis.module'
import { OBSConnectionResolver } from './connection.resolver'
import { OBSConnectionService } from './connection.service'
import { OBSResolver } from './_.resolver'
import { OBSScenesResolver } from './scenes.resolver'
import { OBSScenesService } from './scenes.service'
import { OBSAPI } from './_.service'
import { OBSStreamService } from './stream.service'
import { PubSubModule } from 'src/pubsub.module'
import { OBSStreamResolver } from './stream.resolver'

@Module({
  providers: [
    OBSResolver,
    OBSConnectionResolver,
    OBSConnectionService,
    OBSScenesResolver,
    OBSScenesService,
    OBSStreamResolver,
    OBSStreamService,
    OBSAPI,
  ],
  imports: [RedisModule, PubSubModule],
  exports: [OBSStreamService, OBSScenesService],
})
export class OBSModule {}
