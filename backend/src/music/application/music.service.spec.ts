import { Test, TestingModule } from '@nestjs/testing'
import { MusicService } from './music.service'
import {
  IMusicProvider,
  MUSIC_PROVIDER_TOKEN,
} from '../domain/music-provider.interface'
import { TrackEntity } from '../domain/track.entity'
import { PlaybackStateEntity } from '../domain/playback-state.entity'

describe('MusicService', () => {
  let service: MusicService
  let musicProvider: jest.Mocked<IMusicProvider>

  const mockTrack = TrackEntity.create({
    id: 'track123',
    name: 'Test Song',
    artists: ['Test Artist'],
    album: 'Test Album',
    releaseDate: '2024',
    coverUrl: 'https://example.com/cover.jpg',
    externalUrl: 'https://example.com/track',
    durationMs: 180000,
  })

  const mockPlaybackState = PlaybackStateEntity.create({
    track: mockTrack,
    progressMs: 60000,
    isPlaying: true,
  })

  beforeEach(async () => {
    const musicProviderMock: jest.Mocked<IMusicProvider> = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getCurrentTrack: jest.fn(),
      getCurrentPlaybackState: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
      onTrackChange: jest.fn(),
      onProgressChange: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicService,
        { provide: MUSIC_PROVIDER_TOKEN, useValue: musicProviderMock },
      ],
    }).compile()

    service = module.get<MusicService>(MusicService)
    musicProvider = module.get(MUSIC_PROVIDER_TOKEN)
  })

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined()
    })

    it('should inject music provider', () => {
      expect(musicProvider).toBeDefined()
    })
  })

  describe('initialize', () => {
    it('should call provider initialize', async () => {
      await service.initialize()

      expect(musicProvider.initialize).toHaveBeenCalledTimes(1)
    })

    it('should propagate initialization errors', async () => {
      const error = new Error('Provider initialization failed')
      musicProvider.initialize.mockRejectedValue(error)

      await expect(service.initialize()).rejects.toThrow(
        'Provider initialization failed',
      )
    })
  })

  describe('getCurrentTrack', () => {
    it('should return current track from provider', () => {
      musicProvider.getCurrentTrack.mockReturnValue(mockTrack)

      const result = service.getCurrentTrack()

      expect(result).toBe(mockTrack)
      expect(musicProvider.getCurrentTrack).toHaveBeenCalledTimes(1)
    })

    it('should return null when no track is playing', () => {
      musicProvider.getCurrentTrack.mockReturnValue(null)

      const result = service.getCurrentTrack()

      expect(result).toBeNull()
    })
  })

  describe('getCurrentPlaybackState', () => {
    it('should return playback state from provider', async () => {
      musicProvider.getCurrentPlaybackState.mockResolvedValue(mockPlaybackState)

      const result = await service.getCurrentPlaybackState()

      expect(result).toBe(mockPlaybackState)
      expect(musicProvider.getCurrentPlaybackState).toHaveBeenCalledTimes(1)
    })

    it('should return null when playback is stopped', async () => {
      musicProvider.getCurrentPlaybackState.mockResolvedValue(null)

      const result = await service.getCurrentPlaybackState()

      expect(result).toBeNull()
    })
  })

  describe('startPolling', () => {
    it('should delegate to provider', () => {
      service.startPolling()

      expect(musicProvider.startPolling).toHaveBeenCalledTimes(1)
    })
  })

  describe('stopPolling', () => {
    it('should delegate to provider', () => {
      service.stopPolling()

      expect(musicProvider.stopPolling).toHaveBeenCalledTimes(1)
    })
  })

  describe('onTrackChange', () => {
    it('should register callback with provider', () => {
      const callback = jest.fn()

      service.onTrackChange(callback)

      expect(musicProvider.onTrackChange).toHaveBeenCalledWith(callback)
    })

    it('should support multiple callbacks', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      service.onTrackChange(callback1)
      service.onTrackChange(callback2)

      expect(musicProvider.onTrackChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('onProgressChange', () => {
    it('should register callback with provider', () => {
      const callback = jest.fn()

      service.onProgressChange(callback)

      expect(musicProvider.onProgressChange).toHaveBeenCalledWith(callback)
    })

    it('should support multiple callbacks', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      service.onProgressChange(callback1)
      service.onProgressChange(callback2)

      expect(musicProvider.onProgressChange).toHaveBeenCalledTimes(2)
    })
  })
})
