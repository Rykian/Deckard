import { Module } from '@nestjs/common'
import { TwitchModule } from 'src/twitch/module'
import { WoWLogEventService } from './logevent.service'
import { WoWService } from './service'

@Module({
  imports: [TwitchModule],
  providers: [WoWLogEventService, WoWService],
})
export class WoWModule {}
