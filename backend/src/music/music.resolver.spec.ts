import { Test, TestingModule } from '@nestjs/testing'
import { PubSub } from 'graphql-subscriptions'
import { MusicResolver, MusicTopics } from './music.resolver'
import { MusicService } from './application/music.service'
import { Track } from './track.model'
import { TrackEntity } from './domain/track.entity'

describe('MusicResolver', () => {
  let resolver: MusicResolver
  let musicService: jest.Mocked<MusicService>
  let pubsub: jest.Mocked<PubSub>
  let trackChangeCallback: (track: TrackEntity | null) => void
  let progressChangeCallback: (progressMs: number | null) => void

  const mockTrackEntity = TrackEntity.create({
    id: 'track123',
    name: 'Test Song',
    artists: ['Test Artist'],
    album: 'Test Album',
    releaseDate: '2024',
    coverUrl: 'https://example.com/cover.jpg',
    externalUrl: 'https://example.com/track',
    durationMs: 180000,
  })

  beforeEach(async () => {
    const musicServiceMock = {
      getCurrentTrack: jest.fn(),
      onTrackChange: jest.fn((callback) => {
        trackChangeCallback = callback
      }),
      onProgressChange: jest.fn((callback) => {
        progressChangeCallback = callback
      }),
    } as unknown as jest.Mocked<MusicService>

    const pubsubMock = {
      publish: jest.fn(),
      asyncIterator: jest.fn(),
    } as unknown as jest.Mocked<PubSub>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicResolver,
        { provide: MusicService, useValue: musicServiceMock },
        { provide: PubSub, useValue: pubsubMock },
      ],
    }).compile()

    resolver = module.get<MusicResolver>(MusicResolver)
    musicService = module.get(MusicService)
    pubsub = module.get(PubSub)
  })

  describe('constructor', () => {
    it('should subscribe to track changes', () => {
      expect(musicService.onTrackChange).toHaveBeenCalledWith(
        expect.any(Function),
      )
    })

    it('should subscribe to progress changes', () => {
      expect(musicService.onProgressChange).toHaveBeenCalledWith(
        expect.any(Function),
      )
    })

    it('should publish track changes to pubsub', () => {
      trackChangeCallback(mockTrackEntity)

      expect(pubsub.publish).toHaveBeenCalledWith(
        MusicTopics.CURRENT_TRACK,
        expect.objectContaining({
          id: 'track123',
          name: 'Test Song',
        }),
      )
    })

    it('should publish null when track is null', () => {
      trackChangeCallback(null)

      expect(pubsub.publish).toHaveBeenCalledWith(
        MusicTopics.CURRENT_TRACK,
        null,
      )
    })

    it('should publish progress changes to pubsub', () => {
      progressChangeCallback(60000)

      expect(pubsub.publish).toHaveBeenCalledWith(MusicTopics.PROGRESS, 60000)
    })
  })

  describe('getCurrentTrack', () => {
    it('should return current track when available', () => {
      musicService.getCurrentTrack.mockReturnValue(mockTrackEntity)

      const result = resolver.getCurrentTrack()

      expect(result).toBeInstanceOf(Track)
      expect(result?.id).toBe('track123')
      expect(result?.name).toBe('Test Song')
      expect(result?.artists).toEqual(['Test Artist'])
      expect(result?.album).toBe('Test Album')
      expect(result?.duration).toBe(180000)
    })

    it('should return null when no track is playing', () => {
      musicService.getCurrentTrack.mockReturnValue(null)

      const result = resolver.getCurrentTrack()

      expect(result).toBeNull()
    })

    it('should map entity to GraphQL model correctly', () => {
      musicService.getCurrentTrack.mockReturnValue(mockTrackEntity)

      const result = resolver.getCurrentTrack()

      expect(result).toMatchObject({
        id: mockTrackEntity.id,
        name: mockTrackEntity.name,
        artists: mockTrackEntity.artists,
        album: mockTrackEntity.album,
        release: mockTrackEntity.releaseDate,
        cover: mockTrackEntity.coverUrl,
        url: mockTrackEntity.externalUrl,
        duration: mockTrackEntity.durationMs,
      })
    })
  })

  describe('currentTrackUpdated', () => {
    it('should return an async iterator', () => {
      const mockIterator = Symbol('iterator')
      pubsub.asyncIterator.mockReturnValue(mockIterator as any)

      const result = resolver.currentTrackUpdated()

      expect(pubsub.asyncIterator).toHaveBeenCalledWith(
        MusicTopics.CURRENT_TRACK,
      )
      expect(result).toBe(mockIterator)
    })
  })

  describe('currentTrackProgress', () => {
    it('should return an async iterator for progress updates', () => {
      const mockIterator = Symbol('iterator')
      pubsub.asyncIterator.mockReturnValue(mockIterator as any)

      const result = resolver.currentTrackProgress()

      expect(pubsub.asyncIterator).toHaveBeenCalledWith(MusicTopics.PROGRESS)
      expect(result).toBe(mockIterator)
    })
  })
})
