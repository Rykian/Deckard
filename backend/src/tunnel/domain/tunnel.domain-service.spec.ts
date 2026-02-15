import { Test, TestingModule } from '@nestjs/testing'
import { TunnelDomainService } from './tunnel.domain-service'
import { TunnelingAdapter } from '../infrastructure/tunneling.adapter'
import { EnvironmentService } from '../../env.service'

describe('TunnelDomainService', () => {
  let service: TunnelDomainService
  let adapter: TunnelingAdapter
  let env: EnvironmentService
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TunnelDomainService,
        {
          provide: TunnelingAdapter,
          useValue: {
            createTunnel: jest.fn(),
            getAvailablePort: jest.fn(),
          },
        },
        {
          provide: EnvironmentService,
          useValue: {
            TUNNEL_SUBDOMAIN: 'test-subdomain',
          },
        },
      ],
    }).compile()

    service = module.get<TunnelDomainService>(TunnelDomainService)
    adapter = module.get<TunnelingAdapter>(TunnelingAdapter)
    env = module.get<EnvironmentService>(EnvironmentService)
  })

  afterEach(async () => {
    await module.close()
  })

  describe('createTunnel', () => {
    it('should create a tunnel with given port and subdomain', async () => {
      const mockUrl = 'https://example.loca.lt'
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue({
        url: mockUrl,
        port: 3000,
        subdomain: 'example',
      })

      const tunnel = await service.createTunnel(3000, 'example')

      expect(tunnel.url).toBe(mockUrl)
      expect(tunnel.port).toBe(3000)
      expect(tunnel.subdomain).toBe('example')
      expect(adapter.createTunnel).toHaveBeenCalledWith(3000, 'example')
    })

    it('should propagate adapter errors', async () => {
      const error = new Error('Tunnel creation failed')
      ;(adapter.createTunnel as jest.Mock).mockRejectedValue(error)

      await expect(service.createTunnel(3000, 'example')).rejects.toThrow(error)
    })
  })

  describe('establishTunnel', () => {
    it('should get available port and create tunnel', async () => {
      const mockPort = 3001
      const mockUrl = 'https://test-subdomain.loca.lt'
      ;(adapter.getAvailablePort as jest.Mock).mockResolvedValue(mockPort)
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue({
        url: mockUrl,
        port: mockPort,
        subdomain: 'test-subdomain',
      })

      const tunnel = await service.establishTunnel()

      expect(tunnel.url).toBe(mockUrl)
      expect(tunnel.port).toBe(mockPort)
      expect(tunnel.subdomain).toBe('test-subdomain')
      expect(adapter.getAvailablePort).toHaveBeenCalled()
      expect(adapter.createTunnel).toHaveBeenCalledWith(
        mockPort,
        'test-subdomain',
      )
    })

    it('should use environment subdomain', async () => {
      const mockPort = 3001
      const mockUrl = 'https://test-subdomain.loca.lt'
      ;(adapter.getAvailablePort as jest.Mock).mockResolvedValue(mockPort)
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue({
        url: mockUrl,
        port: mockPort,
        subdomain: 'test-subdomain',
      })

      await service.establishTunnel()

      expect(adapter.createTunnel).toHaveBeenCalledWith(
        mockPort,
        env.TUNNEL_SUBDOMAIN,
      )
    })

    it('should cache tunnel and return same instance on subsequent calls', async () => {
      const mockPort = 3001
      const mockUrl = 'https://test-subdomain.loca.lt'
      ;(adapter.getAvailablePort as jest.Mock).mockResolvedValue(mockPort)
      ;(adapter.createTunnel as jest.Mock).mockResolvedValue({
        url: mockUrl,
        port: mockPort,
        subdomain: 'test-subdomain',
      })

      const tunnel1 = await service.establishTunnel()
      const tunnel2 = await service.establishTunnel()

      expect(tunnel1).toBe(tunnel2)
      expect(adapter.getAvailablePort).toHaveBeenCalledTimes(1)
      expect(adapter.createTunnel).toHaveBeenCalledTimes(1)
    })

    it('should handle port retrieval errors', async () => {
      const error = new Error('No available ports')
      ;(adapter.getAvailablePort as jest.Mock).mockRejectedValue(error)

      await expect(service.establishTunnel()).rejects.toThrow(error)
    })

    it('should handle tunnel creation errors after port retrieval', async () => {
      const mockPort = 3001
      const error = new Error('Subdomain already in use')
      ;(adapter.getAvailablePort as jest.Mock).mockResolvedValue(mockPort)
      ;(adapter.createTunnel as jest.Mock).mockRejectedValue(error)

      await expect(service.establishTunnel()).rejects.toThrow(error)
    })
  })
})
