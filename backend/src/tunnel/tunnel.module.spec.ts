import { Test, TestingModule } from '@nestjs/testing'
import { EventEmitter } from 'events'
import fs from 'node:fs'
import { Tunnel } from 'cloudflared'
import { TunnelModule } from './tunnel.module'
import { TunnelDomainService } from './domain/tunnel.domain-service'
import {
  TunnelingAdapter,
  getHostnameFromUrl,
} from './infrastructure/tunneling.adapter'
import { EnvironmentService } from '../env.service'

jest.mock('cloudflared', () => ({
  Tunnel: { withToken: jest.fn() },
  bin: '/tmp/cloudflared',
  install: jest.fn(),
}))

describe('TunnelModule Integration', () => {
  let module: TestingModule
  let tunnelService: TunnelDomainService

  beforeEach(async () => {
    jest.clearAllMocks()

    const builder = Test.createTestingModule({
      imports: [TunnelModule],
    })

    builder.overrideProvider(EnvironmentService).useValue({
      PORT: 3000,
      CLOUDFLARE_TUNNEL_TOKEN: 'test-token-123',
      CLOUDFLARE_CUSTOM_DOMAIN: 'test.example.com',
    })

    module = await builder.compile()

    tunnelService = module.get<TunnelDomainService>(TunnelDomainService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(tunnelService).toBeDefined()
  })

  it('should expose TunnelDomainService', () => {
    const adapter = module.get<TunnelingAdapter>(TunnelingAdapter)
    expect(adapter).toBeDefined()
  })

  it('should establish tunnel end-to-end', async () => {
    const mockUrl = 'https://test.example.com'
    const mockTunnel = new EventEmitter()
    ;(Tunnel.withToken as jest.Mock).mockReturnValue(mockTunnel)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    const tunnelPromise = tunnelService.establishTunnel()

    // Wait for async setup
    await new Promise((resolve) => setTimeout(resolve, 10))

    const tunnel = await tunnelPromise

    expect(tunnel).toBe(mockUrl)
    expect(getHostnameFromUrl(tunnel)).toBe('test.example.com')
  })

  it('should create tunnel and return URL', async () => {
    const mockUrl = 'https://test.example.com'
    const mockTunnel = new EventEmitter()
    ;(Tunnel.withToken as jest.Mock).mockReturnValue(mockTunnel)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    const tunnelPromise = tunnelService.createTunnel()

    // Wait for async setup
    await new Promise((resolve) => setTimeout(resolve, 10))

    const tunnel = await tunnelPromise

    expect(tunnel).toBe(mockUrl)
    expect(Tunnel.withToken).toHaveBeenCalledWith('test-token-123', {
      '--protocol': 'http2',
    })
  })
})
