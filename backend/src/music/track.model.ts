import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TrackEntity } from './domain/track.entity'

/**
 * GraphQL Model: Track
 * Presentation layer model for GraphQL API
 */
@ObjectType()
export class Track {
  @Field(() => ID)
  id: string

  @Field(() => [String])
  artists: string[]

  @Field()
  album: string

  @Field()
  name: string

  @Field()
  release: string

  @Field()
  cover: string

  @Field()
  url: string

  @Field({ description: 'Duration in ms' })
  duration: number

  static fromEntity(entity: TrackEntity): Track {
    const track = new Track()
    track.id = entity.id
    track.artists = entity.artists
    track.album = entity.album
    track.name = entity.name
    track.release = entity.releaseDate
    track.cover = entity.coverUrl
    track.url = entity.externalUrl
    track.duration = entity.durationMs
    return track
  }
}
