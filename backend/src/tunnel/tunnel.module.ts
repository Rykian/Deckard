import { Module } from '@nestjs/common'
import { TunnelDomainService } from './domain/tunnel.domain-service'
import { TunnelingAdapter } from './infrastructure/tunneling.adapter'
import { EnvironmentService } from '../env.service'
import { TunnelResolver } from './tunnel.resolver'

@Module({
  providers: [
    TunnelingAdapter,
    TunnelDomainService,
    EnvironmentService,
    TunnelResolver,
  ],
  exports: [TunnelDomainService],
})
export class TunnelModule {}
