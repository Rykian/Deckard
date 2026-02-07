import { Track } from './track.model'
import { TrackEntity } from './domain/track.entity'

describe('Track (GraphQL Model)', () => {
  const mockTrackEntity = TrackEntity.create({
    id: 'track123',
    name: 'Test Song',
    artists: ['Artist 1', 'Artist 2'],
    album: 'Test Album',
    releaseDate: '2024-01-15',
    coverUrl: 'https://example.com/cover.jpg',
    externalUrl: 'https://example.com/track/123',
    durationMs: 210000,
  })

  describe('fromEntity', () => {
    it('should map TrackEntity to Track model', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(track).toBeInstanceOf(Track)
      expect(track.id).toBe(mockTrackEntity.id)
      expect(track.name).toBe(mockTrackEntity.name)
      expect(track.artists).toEqual(mockTrackEntity.artists)
      expect(track.album).toBe(mockTrackEntity.album)
      expect(track.release).toBe(mockTrackEntity.releaseDate)
      expect(track.cover).toBe(mockTrackEntity.coverUrl)
      expect(track.url).toBe(mockTrackEntity.externalUrl)
      expect(track.duration).toBe(mockTrackEntity.durationMs)
    })

    it('should correctly map releaseDate to release field', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(track.release).toBe('2024-01-15')
      expect(track.release).toBe(mockTrackEntity.releaseDate)
    })

    it('should correctly map coverUrl to cover field', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(track.cover).toBe('https://example.com/cover.jpg')
      expect(track.cover).toBe(mockTrackEntity.coverUrl)
    })

    it('should correctly map externalUrl to url field', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(track.url).toBe('https://example.com/track/123')
      expect(track.url).toBe(mockTrackEntity.externalUrl)
    })

    it('should correctly map durationMs to duration field', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(track.duration).toBe(210000)
      expect(track.duration).toBe(mockTrackEntity.durationMs)
    })

    it('should handle single artist', () => {
      const entity = TrackEntity.create({
        ...mockTrackEntity,
        artists: ['Single Artist'],
      })

      const track = Track.fromEntity(entity)

      expect(track.artists).toEqual(['Single Artist'])
      expect(track.artists.length).toBe(1)
    })

    it('should handle multiple artists', () => {
      const entity = TrackEntity.create({
        ...mockTrackEntity,
        artists: ['Artist 1', 'Artist 2', 'Artist 3'],
      })

      const track = Track.fromEntity(entity)

      expect(track.artists).toEqual(['Artist 1', 'Artist 2', 'Artist 3'])
      expect(track.artists.length).toBe(3)
    })

    it('should handle empty cover URL', () => {
      const entity = TrackEntity.create({
        ...mockTrackEntity,
        coverUrl: '',
      })

      const track = Track.fromEntity(entity)

      expect(track.cover).toBe('')
    })

    it('should handle empty external URL', () => {
      const entity = TrackEntity.create({
        ...mockTrackEntity,
        externalUrl: '',
      })

      const track = Track.fromEntity(entity)

      expect(track.url).toBe('')
    })

    it('should create a new Track instance each time', () => {
      const track1 = Track.fromEntity(mockTrackEntity)
      const track2 = Track.fromEntity(mockTrackEntity)

      expect(track1).not.toBe(track2)
      expect(track1).toEqual(track2)
    })
  })

  describe('GraphQL field mappings', () => {
    it('should have all required GraphQL fields', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(track).toHaveProperty('id')
      expect(track).toHaveProperty('artists')
      expect(track).toHaveProperty('album')
      expect(track).toHaveProperty('name')
      expect(track).toHaveProperty('release')
      expect(track).toHaveProperty('cover')
      expect(track).toHaveProperty('url')
      expect(track).toHaveProperty('duration')
    })

    it('should maintain correct types for GraphQL fields', () => {
      const track = Track.fromEntity(mockTrackEntity)

      expect(typeof track.id).toBe('string')
      expect(Array.isArray(track.artists)).toBe(true)
      expect(typeof track.album).toBe('string')
      expect(typeof track.name).toBe('string')
      expect(typeof track.release).toBe('string')
      expect(typeof track.cover).toBe('string')
      expect(typeof track.url).toBe('string')
      expect(typeof track.duration).toBe('number')
    })
  })
})
