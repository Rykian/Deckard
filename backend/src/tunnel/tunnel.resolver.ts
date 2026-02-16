import { Query, Resolver } from '@nestjs/graphql'
import { TunnelDomainService } from './domain/tunnel.domain-service'

@Resolver()
export class TunnelResolver {
  constructor(private tunnelService: TunnelDomainService) {}

  @Query(() => String)
  async tunnelGetUrl(): Promise<string> {
    return this.tunnelService.establishTunnel()
  }
}
