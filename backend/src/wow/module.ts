import { Module } from '@nestjs/common';
import { WoWLogEventService } from './logevent.service';

@Module({
  providers: [WoWLogEventService],
})
export class WoWModule {}
