import { Int, Query, Resolver, Subscription } from '@nestjs/graphql'
import { setTimeout } from 'timers/promises'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { MusicService } from './application/music.service'
import { Track } from './track.model'

export enum MusicTopics {
  CURRENT_TRACK = 'music:current_track',
  PROGRESS = 'music:current_track:progress',
}

/**
 * GraphQL Resolver: Music
 * Exposes music functionality through GraphQL API
 */
@Resolver()
export class MusicResolver {
  constructor(
    private readonly service: MusicService,
    private readonly pubsub: PubSub,
  ) {
    // Subscribe to track changes from the service
    this.service.onTrackChange((track) => {
      const model = track ? Track.fromEntity(track) : null
      this.pubsub.publish(MusicTopics.CURRENT_TRACK, model)
    })

    // Subscribe to progress changes from the service
    this.service.onProgressChange((progress) => {
      this.pubsub.publish(MusicTopics.PROGRESS, progress)
    })
  }

  @Query(() => Track, { nullable: true })
  getCurrentTrack(): Track | null {
    const track = this.service.getCurrentTrack()
    return track ? Track.fromEntity(track) : null
  }

  @Subscription(() => Track, { nullable: true, resolve: (payload) => payload })
  currentTrackUpdated() {
    setTimeout(1000).then(() => {
      const track = this.service.getCurrentTrack()
      const model = track ? Track.fromEntity(track) : null
      this.pubsub.publish(MusicTopics.CURRENT_TRACK, model)
    })
    return this.pubsub.asyncIterator(MusicTopics.CURRENT_TRACK)
  }

  @Subscription(() => Int, { nullable: true, resolve: identity })
  currentTrackProgress() {
    return this.pubsub.asyncIterator(MusicTopics.PROGRESS)
  }
}
