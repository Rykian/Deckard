import { Injectable, Logger } from '@nestjs/common'
import fs from 'node:fs'
import { Tunnel, bin, install } from 'cloudflared'
import { EnvironmentService } from '../../env.service'

export interface ITunnelConfig {
  url: string
}

export function getHostnameFromUrl(url: string): string {
  const urlObj = new URL(url)
  return urlObj.hostname
}

@Injectable()
export class TunnelingAdapter {
  private logger = new Logger(TunnelingAdapter.name)
  private tunnel: Tunnel | null = null

  constructor(private env: EnvironmentService) {}

  async createTunnel(): Promise<string> {
    return this.startCloudflared()
  }

  private startCloudflared(): Promise<string> {
    return new Promise((resolve, reject) => {
      const tunnelToken = this.env.CLOUDFLARE_TUNNEL_TOKEN
      const customDomain = this.env.CLOUDFLARE_CUSTOM_DOMAIN

      const handleError = (error: Error) => {
        cleanup()
        reject(error)
      }

      const cleanup = () => {
        this.tunnel?.removeListener('error', handleError)
      }

      void (async () => {
        try {
          if (!fs.existsSync(bin)) {
            this.logger.log('Installing cloudflared binary...')
            await install(bin)
          }

          this.logger.log(
            `Starting Cloudflare Tunnel with custom domain: ${customDomain}`,
          )

          this.tunnel = Tunnel.withToken(tunnelToken, {
            '--protocol': 'http2',
          })

          // For token-based tunnels, the URL is pre-configured in Cloudflare
          // Wait a moment for tunnel to connect, then resolve with the custom domain
          this.tunnel.once('error', handleError)
          this.tunnel.on('stderr', (data) => {
            const message = data.toString()
            this.logger.debug(`cloudflared: ${message}`)
          })
          this.tunnel.on('url', (url) =>
            this.logger.debug(`Cloudflared URL event: ${url}`),
          )
          this.tunnel.on('stderr', (data) =>
            this.logger.error(`cloudflared stderr: ${data.toString()}`),
          )
          this.tunnel.on('stdout', (data) =>
            this.logger.debug(`cloudflared stdout: ${data.toString()}`),
          )

          setTimeout(() => {
            cleanup()
            resolve(`https://${customDomain}`)
          }, 2000)
        } catch (error) {
          cleanup()
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      })()
    })
  }
}
