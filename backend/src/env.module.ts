import { Module } from '@nestjs/common';
import { EnvironmentService } from './env.service';

@Module({
  exports: [EnvironmentService],
  providers: [EnvironmentService],
})
export class EnvironmentModule {}
