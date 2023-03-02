import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Track {
  constructor(data?: SpotifyApi.TrackObjectFull) {
    if (!data) return

    this.album = data.album.name
    this.artists = data.artists.map((artist) => artist.name)
    this.id = data.id
    this.release = data.album.release_date
    this.cover = (
      data.album.images.find((image) => (image.width || 1000) < 600) ||
      data.album.images[0]
    ).url
    this.name = data.name
    this.url = data.external_urls['spotify']
    this.duration = data.duration_ms
  }

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
}
