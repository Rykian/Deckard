import { TrackEntity } from './track.entity'

describe('TrackEntity', () => {
  const validTrackParams = {
    id: 'track123',
    name: 'Test Song',
    artists: ['Artist 1', 'Artist 2'],
    album: 'Test Album',
    releaseDate: '2024-01-15',
    coverUrl: 'https://example.com/cover.jpg',
    externalUrl: 'https://example.com/track/123',
    durationMs: 210000,
  }

  describe('constructor', () => {
    it('should create a track entity with all properties', () => {
      const track = new TrackEntity(
        validTrackParams.id,
        validTrackParams.name,
        validTrackParams.artists,
        validTrackParams.album,
        validTrackParams.releaseDate,
        validTrackParams.coverUrl,
        validTrackParams.externalUrl,
        validTrackParams.durationMs,
      )

      expect(track.id).toBe(validTrackParams.id)
      expect(track.name).toBe(validTrackParams.name)
      expect(track.artists).toEqual(validTrackParams.artists)
      expect(track.album).toBe(validTrackParams.album)
      expect(track.releaseDate).toBe(validTrackParams.releaseDate)
      expect(track.coverUrl).toBe(validTrackParams.coverUrl)
      expect(track.externalUrl).toBe(validTrackParams.externalUrl)
      expect(track.durationMs).toBe(validTrackParams.durationMs)
    })

    it('should have readonly properties', () => {
      const track = new TrackEntity(
        validTrackParams.id,
        validTrackParams.name,
        validTrackParams.artists,
        validTrackParams.album,
        validTrackParams.releaseDate,
        validTrackParams.coverUrl,
        validTrackParams.externalUrl,
        validTrackParams.durationMs,
      )

      // Properties are readonly - this is enforced at compile time
      expect(track.id).toBe(validTrackParams.id)
      expect(track.name).toBe(validTrackParams.name)
    })
  })

  describe('create', () => {
    it('should create a track entity using factory method', () => {
      const track = TrackEntity.create(validTrackParams)

      expect(track).toBeInstanceOf(TrackEntity)
      expect(track.id).toBe(validTrackParams.id)
      expect(track.name).toBe(validTrackParams.name)
      expect(track.artists).toEqual(validTrackParams.artists)
      expect(track.album).toBe(validTrackParams.album)
      expect(track.releaseDate).toBe(validTrackParams.releaseDate)
      expect(track.coverUrl).toBe(validTrackParams.coverUrl)
      expect(track.externalUrl).toBe(validTrackParams.externalUrl)
      expect(track.durationMs).toBe(validTrackParams.durationMs)
    })

    it('should handle single artist', () => {
      const track = TrackEntity.create({
        ...validTrackParams,
        artists: ['Single Artist'],
      })

      expect(track.artists).toEqual(['Single Artist'])
      expect(track.artists.length).toBe(1)
    })

    it('should handle multiple artists', () => {
      const track = TrackEntity.create({
        ...validTrackParams,
        artists: ['Artist 1', 'Artist 2', 'Artist 3'],
      })

      expect(track.artists.length).toBe(3)
      expect(track.artists).toContain('Artist 1')
      expect(track.artists).toContain('Artist 2')
      expect(track.artists).toContain('Artist 3')
    })

    it('should handle empty cover URL', () => {
      const track = TrackEntity.create({
        ...validTrackParams,
        coverUrl: '',
      })

      expect(track.coverUrl).toBe('')
    })

    it('should handle empty external URL', () => {
      const track = TrackEntity.create({
        ...validTrackParams,
        externalUrl: '',
      })

      expect(track.externalUrl).toBe('')
    })

    it('should handle different duration values', () => {
      const shortTrack = TrackEntity.create({
        ...validTrackParams,
        durationMs: 30000, // 30 seconds
      })
      expect(shortTrack.durationMs).toBe(30000)

      const longTrack = TrackEntity.create({
        ...validTrackParams,
        durationMs: 600000, // 10 minutes
      })
      expect(longTrack.durationMs).toBe(600000)
    })
  })

  describe('data integrity', () => {
    it('should preserve artist data', () => {
      const track = TrackEntity.create(validTrackParams)
      const originalArtists = [...track.artists]

      // Artists array is accessible
      expect(track.artists).toEqual(originalArtists)
      expect(track.artists.length).toBe(2)
    })
  })
})
