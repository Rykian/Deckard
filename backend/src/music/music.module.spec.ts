import { Test, TestingModule } from '@nestjs/testing'
import { MusicModule } from './music.module'
import { MusicService } from './application/music.service'
import { AppleMusicAdapter } from './infrastructure/apple-music/apple-music.adapter'
import { MusicResolver } from './music.resolver'
import { MUSIC_PROVIDER_TOKEN } from './domain/music-provider.interface'
import { PubSubModule } from '../pubsub.module'

describe('MusicModule', () => {
  let module: TestingModule
  let musicService: MusicService

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MusicModule, PubSubModule],
    }).compile()

    musicService = module.get<MusicService>(MusicService)
  })

  afterEach(async () => {
    await module.close()
  })

  describe('module configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined()
    })

    it('should provide MUSIC_PROVIDER_TOKEN with AppleMusicAdapter', () => {
      const provider = module.get(MUSIC_PROVIDER_TOKEN)
      expect(provider).toBeInstanceOf(AppleMusicAdapter)
    })

    it('should provide MusicService', () => {
      const service = module.get(MusicService)
      expect(service).toBeInstanceOf(MusicService)
    })

    it('should provide MusicResolver', () => {
      const resolver = module.get(MusicResolver)
      expect(resolver).toBeInstanceOf(MusicResolver)
    })

    it('should export MusicService', () => {
      const service = module.get(MusicService)
      expect(service).toBeDefined()
    })
  })

  describe('onModuleInit', () => {
    it('should initialize the music service', async () => {
      const initializeSpy = jest
        .spyOn(musicService, 'initialize')
        .mockResolvedValue()

      const musicModule = new MusicModule(musicService)
      await musicModule.onModuleInit()

      expect(initializeSpy).toHaveBeenCalledTimes(1)
    })

    it('should propagate initialization errors', async () => {
      const error = new Error('Initialization failed')
      jest.spyOn(musicService, 'initialize').mockRejectedValue(error)

      const musicModule = new MusicModule(musicService)

      await expect(musicModule.onModuleInit()).rejects.toThrow(
        'Initialization failed',
      )
    })
  })
})
