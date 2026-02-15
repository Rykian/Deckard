import { Injectable, Logger } from '@nestjs/common'
import {
  TunnelingAdapter,
  ITunnelConfig,
  getHostnameFromUrl,
} from '../infrastructure/tunneling.adapter'
import { EnvironmentService } from '../../env.service'

@Injectable()
export class TunnelDomainService {
  private logger = new Logger(TunnelDomainService.name)
  private cachedTunnel: ITunnelConfig | null = null
  constructor(
    private localtunnelAdapter: TunnelingAdapter,
    private env: EnvironmentService,
  ) {}

  async createTunnel(port: number, subdomain: string): Promise<ITunnelConfig> {
    return this.localtunnelAdapter.createTunnel(port, subdomain)
  }

  async establishTunnel(): Promise<ITunnelConfig> {
    if (this.cachedTunnel) {
      this.logger.debug('Returning cached tunnel')
      return this.cachedTunnel
    }

    const port = await this.localtunnelAdapter.getAvailablePort()
    const tunnel = await this.createTunnel(port, this.env.TUNNEL_SUBDOMAIN)
    this.logger.debug(`Tunnel established: ${getHostnameFromUrl(tunnel.url)}`)
    this.cachedTunnel = tunnel
    return tunnel
  }
}
