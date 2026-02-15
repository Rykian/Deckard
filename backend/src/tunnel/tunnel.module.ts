import { Module } from '@nestjs/common'
import { TunnelDomainService } from './domain/tunnel.domain-service'
import { TunnelingAdapter } from './infrastructure/tunneling.adapter'
import { EnvironmentService } from '../env.service'

@Module({
  providers: [TunnelingAdapter, TunnelDomainService, EnvironmentService],
  exports: [TunnelDomainService],
})
export class TunnelModule {}
