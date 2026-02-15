import { Test, TestingModule } from '@nestjs/testing'
import { TunnelModule } from './tunnel.module'
import { TunnelDomainService } from './domain/tunnel.domain-service'
import {
  TunnelingAdapter,
  getHostnameFromUrl,
} from './infrastructure/tunneling.adapter'
import { EnvironmentService } from '../env.service'

jest.mock('localtunnel')

describe('TunnelModule Integration', () => {
  let module: TestingModule
  let tunnelService: TunnelDomainService

  beforeEach(async () => {
    jest.clearAllMocks()

    const builder = Test.createTestingModule({
      imports: [TunnelModule],
    })

    builder.overrideProvider(EnvironmentService).useValue({
      TUNNEL_SUBDOMAIN: 'test-app',
    })

    module = await builder.compile()

    tunnelService = module.get<TunnelDomainService>(TunnelDomainService)
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
    const mockPort = 3000
    const mockUrl = 'https://test-app.loca.lt'
    const mockGetPort = jest.fn().mockResolvedValue(mockPort)

    // Get adapter and inject mock getPort
    const adapter = module.get<TunnelingAdapter>(TunnelingAdapter)
    ;(adapter as any).getPort = mockGetPort

    const { default: localtunnel } = await import('localtunnel')
    ;(localtunnel as jest.Mock).mockResolvedValue({ url: mockUrl })

    const tunnel = await tunnelService.establishTunnel()

    expect(tunnel.url).toBe(mockUrl)
    expect(tunnel.port).toBe(mockPort)
    expect(tunnel.subdomain).toBe('test-app')
    expect(getHostnameFromUrl(tunnel.url)).toBe('test-app.loca.lt')
  })

  it('should create tunnel with explicit port', async () => {
    const mockUrl = 'https://myapp.loca.lt'

    const { default: localtunnel } = await import('localtunnel')
    ;(localtunnel as jest.Mock).mockResolvedValue({ url: mockUrl })

    const tunnel = await tunnelService.createTunnel(5000, 'myapp')

    expect(tunnel.url).toBe(mockUrl)
    expect(tunnel.port).toBe(5000)
    expect(tunnel.subdomain).toBe('myapp')
    expect(localtunnel).toHaveBeenCalledWith({
      port: 5000,
      subdomain: 'myapp',
    })
  })
})
