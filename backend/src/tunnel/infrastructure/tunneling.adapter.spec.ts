import { Test, TestingModule } from '@nestjs/testing'
import { TunnelingAdapter } from './tunneling.adapter'

jest.mock('localtunnel')

describe('TunnelingAdapter', () => {
  let adapter: TunnelingAdapter
  let module: TestingModule

  beforeEach(async () => {
    jest.clearAllMocks()

    module = await Test.createTestingModule({
      providers: [TunnelingAdapter],
    }).compile()

    adapter = module.get<TunnelingAdapter>(TunnelingAdapter)
  })

  describe('getAvailablePort', () => {
    it('should return an available port', async () => {
      const mockPort = 3000
      const mockGetPort = jest.fn().mockResolvedValue(mockPort)

      // Inject mock getPort
      ;(adapter as any).getPort = mockGetPort

      const port = await adapter.getAvailablePort()

      expect(port).toBe(mockPort)
      expect(mockGetPort).toHaveBeenCalled()
    })

    it('should handle port retrieval errors', async () => {
      const error = new Error('Failed to get port')
      const mockGetPort = jest.fn().mockRejectedValue(error)

      // Inject mock getPort
      ;(adapter as any).getPort = mockGetPort

      await expect(adapter.getAvailablePort()).rejects.toThrow(error)
    })
  })

  describe('createTunnel', () => {
    it('should create a tunnel with given port and subdomain', async () => {
      const mockUrl = 'https://example.loca.lt'
      const { default: localtunnel } = await import('localtunnel')
      ;(localtunnel as jest.Mock).mockResolvedValue({ url: mockUrl })

      const result = await adapter.createTunnel(3000, 'example')

      expect(result).toEqual({ url: mockUrl, port: 3000, subdomain: 'example' })
      expect(localtunnel).toHaveBeenCalledWith({
        port: 3000,
        subdomain: 'example',
      })
    })

    it('should handle tunnel creation errors', async () => {
      const error = new Error('Subdomain already in use')
      const { default: localtunnel } = await import('localtunnel')
      ;(localtunnel as jest.Mock).mockRejectedValue(error)

      await expect(adapter.createTunnel(3000, 'example')).rejects.toThrow(error)
    })
  })
})
