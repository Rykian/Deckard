import { Injectable, Logger } from '@nestjs/common'
import {
  TunnelingAdapter,
  getHostnameFromUrl,
} from '../infrastructure/tunneling.adapter'
import { EnvironmentService } from '../../env.service'

@Injectable()
export class TunnelDomainService {
  private logger = new Logger(TunnelDomainService.name)
  private cachedTunnel: string | null = null
  constructor(
    private localtunnelAdapter: TunnelingAdapter,
    private env: EnvironmentService,
  ) {}

  async createTunnel(): Promise<string> {
    return this.localtunnelAdapter.createTunnel()
  }

  async establishTunnel(): Promise<string> {
    if (this.cachedTunnel) {
      this.logger.debug('Returning cached tunnel')
      return this.cachedTunnel
    }

    const tunnel = await this.createTunnel()
    this.logger.debug(`Tunnel established: ${getHostnameFromUrl(tunnel)}`)
    this.cachedTunnel = tunnel
    return tunnel
  }
}
