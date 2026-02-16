import { Test, TestingModule } from '@nestjs/testing'
import { TunnelDomainService } from './tunnel.domain-service'
import { TunnelingAdapter } from '../infrastructure/tunneling.adapter'
import { EnvironmentService } from '../../env.service'

describe('TunnelDomainService', () => {
  let service: TunnelDomainService
  let adapter: TunnelingAdapter
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TunnelDomainService,
        {
          provide: TunnelingAdapter,
          useValue: {
            createTunnel: jest.fn(),
          },
        },
        {
          provide: EnvironmentService,
          useValue: {
            PORT: 3000,
            CLOUDFLARE_TUNNEL_TOKEN: 'test-token',
            CLOUDFLARE_CUSTOM_DOMAIN: 'test.example.com',
          },
        },
      ],
    }).compile()

    service = module.get<TunnelDomainService>(TunnelDomainService)
    adapter = module.get<TunnelingAdapter>(TunnelingAdapter)
  })

  afterEach(async () => {
    await module.close()
  })

  describe('createTunnel', () => {
    it('should create a tunnel and return URL', async () => {
      const mockUrl = 'https://test.example.com'
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue(mockUrl)

      const tunnel = await service.createTunnel()

      expect(tunnel).toBe(mockUrl)
      expect(adapter.createTunnel).toHaveBeenCalled()
    })

    it('should propagate adapter errors', async () => {
      const error = new Error('Tunnel creation failed')
      ;(adapter.createTunnel as jest.Mock).mockRejectedValue(error)

      await expect(service.createTunnel()).rejects.toThrow(error)
    })
  })

  describe('establishTunnel', () => {
    it('should create tunnel and cache it', async () => {
      const mockUrl = 'https://test.example.com'
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue(mockUrl)

      const tunnel = await service.establishTunnel()

      expect(tunnel).toBe(mockUrl)
      expect(adapter.createTunnel).toHaveBeenCalled()
    })

    it('should cache tunnel and return same instance on subsequent calls', async () => {
      const mockUrl = 'https://test.example.com'
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue(mockUrl)

      const tunnel1 = await service.establishTunnel()
      const tunnel2 = await service.establishTunnel()

      expect(tunnel1).toBe(tunnel2)
      expect(adapter.createTunnel).toHaveBeenCalledTimes(1)
    })

    it('should handle tunnel creation errors', async () => {
      const error = new Error('CLOUDFLARE_TUNNEL_TOKEN is required')
      ;(adapter.createTunnel as jest.Mock).mockRejectedValue(error)

      await expect(service.establishTunnel()).rejects.toThrow(error)
    })
  })
})
