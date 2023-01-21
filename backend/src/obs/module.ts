import { Module } from '@nestjs/common';
import { OBSResolver } from './resolver';
import { OBSService } from './service';

@Module({
  providers: [OBSResolver, OBSService],
})
export class OBSModule {}
