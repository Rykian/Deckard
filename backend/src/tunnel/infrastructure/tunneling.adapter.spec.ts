import { Test, TestingModule } from '@nestjs/testing'
import { EventEmitter } from 'events'
import fs from 'node:fs'
import { Tunnel, bin, install } from 'cloudflared'
import { TunnelingAdapter } from './tunneling.adapter'
import { EnvironmentService } from '../../env.service'

jest.mock('cloudflared', () => ({
  Tunnel: { withToken: jest.fn() },
  bin: '/tmp/cloudflared',
  install: jest.fn(),
}))

describe('TunnelingAdapter', () => {
  let adapter: TunnelingAdapter
  let module: TestingModule
  let env: EnvironmentService

  beforeEach(async () => {
    jest.clearAllMocks()

    module = await Test.createTestingModule({
      providers: [
        TunnelingAdapter,
        {
          provide: EnvironmentService,
          useValue: {
            PORT: 3000,
            CLOUDFLARE_TUNNEL_TOKEN: 'test-token-123',
            CLOUDFLARE_CUSTOM_DOMAIN: 'test.example.com',
          },
        },
      ],
    }).compile()

    adapter = module.get<TunnelingAdapter>(TunnelingAdapter)
    env = module.get<EnvironmentService>(EnvironmentService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createTunnel', () => {
    it('should create a tunnel with token and return custom domain URL', async () => {
      const mockTunnel = new EventEmitter()
      ;(Tunnel.withToken as jest.Mock).mockReturnValue(mockTunnel)
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)

      const resultPromise = adapter.createTunnel()

      // Wait for async setup to complete
      await new Promise((resolve) => setTimeout(resolve, 10))

      const result = await resultPromise

      expect(result).toBe('https://test.example.com')
      expect(Tunnel.withToken).toHaveBeenCalledWith('test-token-123', {
        '--protocol': 'http2',
      })
      expect(install).not.toHaveBeenCalled()
    })

    it('should install cloudflared when binary is missing', async () => {
      const mockTunnel = new EventEmitter()
      ;(Tunnel.withToken as jest.Mock).mockReturnValue(mockTunnel)
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)
      ;(install as jest.Mock).mockResolvedValue(bin)

      const resultPromise = adapter.createTunnel()
      await new Promise((resolve) => setTimeout(resolve, 10))

      await resultPromise

      expect(install).toHaveBeenCalledWith(bin)
    })

    it('should handle tunnel errors', async () => {
      const mockTunnel = new EventEmitter()
      ;(Tunnel.withToken as jest.Mock).mockReturnValue(mockTunnel)
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)

      const resultPromise = adapter.createTunnel()

      await new Promise((resolve) => setTimeout(resolve, 10))

      const error = new Error('Tunnel connection failed')
      mockTunnel.emit('error', error)

      await expect(resultPromise).rejects.toThrow('Tunnel connection failed')
    })
  })
})
