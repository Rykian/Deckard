import { Injectable, Logger } from '@nestjs/common'
import localtunnel from 'localtunnel'
import type * as GetPortType from 'get-port'

export interface ITunnelConfig {
  url: string
  port: number
  subdomain: string
}

export function getHostnameFromUrl(url: string): string {
  const urlObj = new URL(url)
  return urlObj.hostname
}

@Injectable()
export class TunnelingAdapter {
  private logger = new Logger(TunnelingAdapter.name)
  private tunnel: localtunnel.Tunnel | null = null
  private getPort: typeof GetPortType.default | null = null

  async getAvailablePort(): Promise<number> {
    // Lazy load get-port
    if (!this.getPort) {
      this.getPort = (await import('get-port')).default
    }
    return this.getPort()
  }

  async createTunnel(port: number, subdomain: string): Promise<ITunnelConfig> {
    this.tunnel = await localtunnel({
      port,
      subdomain,
    })

    if (!this.tunnel.url.includes(subdomain))
      this.logger.warn(
        `Tunnel URL ${this.tunnel.url} does not contain expected subdomain ${subdomain}`,
      )
    return { url: this.tunnel.url, port, subdomain }
  }
}
