import { PlaybackStateEntity } from './playback-state.entity'
import { TrackEntity } from './track.entity'

describe('PlaybackStateEntity', () => {
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

  describe('constructor', () => {
    it('should create playback state with track playing', () => {
      const state = new PlaybackStateEntity(mockTrack, 60000, true)

      expect(state.track).toBe(mockTrack)
      expect(state.progressMs).toBe(60000)
      expect(state.isPlaying).toBe(true)
    })

    it('should create playback state with track paused', () => {
      const state = new PlaybackStateEntity(mockTrack, 120000, false)

      expect(state.track).toBe(mockTrack)
      expect(state.progressMs).toBe(120000)
      expect(state.isPlaying).toBe(false)
    })

    it('should allow null track', () => {
      const state = new PlaybackStateEntity(null, null, false)

      expect(state.track).toBeNull()
      expect(state.progressMs).toBeNull()
      expect(state.isPlaying).toBe(false)
    })

    it('should have readonly properties', () => {
      const state = new PlaybackStateEntity(mockTrack, 60000, true)

      // Properties are readonly - this is enforced at compile time
      expect(state.track).toBe(mockTrack)
      expect(state.progressMs).toBe(60000)
      expect(state.isPlaying).toBe(true)
    })
  })

  describe('create', () => {
    it('should create playing state via factory method', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: 45000,
        isPlaying: true,
      })

      expect(state).toBeInstanceOf(PlaybackStateEntity)
      expect(state.track).toBe(mockTrack)
      expect(state.progressMs).toBe(45000)
      expect(state.isPlaying).toBe(true)
    })

    it('should create paused state via factory method', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: 90000,
        isPlaying: false,
      })

      expect(state.isPlaying).toBe(false)
      expect(state.track).toBe(mockTrack)
      expect(state.progressMs).toBe(90000)
    })

    it('should create stopped state with null values', () => {
      const state = PlaybackStateEntity.create({
        track: null,
        progressMs: null,
        isPlaying: false,
      })

      expect(state.track).toBeNull()
      expect(state.progressMs).toBeNull()
      expect(state.isPlaying).toBe(false)
    })

    it('should handle progress at start of track', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: 0,
        isPlaying: true,
      })

      expect(state.progressMs).toBe(0)
      expect(state.isPlaying).toBe(true)
    })

    it('should handle progress at end of track', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: mockTrack.durationMs,
        isPlaying: false,
      })

      expect(state.progressMs).toBe(mockTrack.durationMs)
    })
  })

  describe('paused', () => {
    it('should create a paused state with null values', () => {
      const state = PlaybackStateEntity.paused()

      expect(state).toBeInstanceOf(PlaybackStateEntity)
      expect(state.track).toBeNull()
      expect(state.progressMs).toBeNull()
      expect(state.isPlaying).toBe(false)
    })

    it('should create a new instance each time', () => {
      const state1 = PlaybackStateEntity.paused()
      const state2 = PlaybackStateEntity.paused()

      expect(state1).not.toBe(state2)
      expect(state1).toEqual(state2)
    })
  })

  describe('edge cases', () => {
    it('should handle playing state with null progress', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: null,
        isPlaying: true,
      })

      expect(state.isPlaying).toBe(true)
      expect(state.progressMs).toBeNull()
    })

    it('should handle negative progress', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: -1000,
        isPlaying: true,
      })

      expect(state.progressMs).toBe(-1000)
    })

    it('should handle progress beyond track duration', () => {
      const state = PlaybackStateEntity.create({
        track: mockTrack,
        progressMs: mockTrack.durationMs + 10000,
        isPlaying: true,
      })

      expect(state.progressMs).toBe(mockTrack.durationMs + 10000)
    })
  })
})
