import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { SpotifyTrackService, Topics } from './track.service'
import { Track } from './track.model'
import { setTimeout } from 'timers/promises'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'

@Resolver()
export class SpotifyResolver {
  constructor(private service: SpotifyTrackService, private pubsub: PubSub) {}
  @Query(() => String)
  getSpotifyAuthURL(@Args('redirectURI') redirectURI: string) {
    return this.service.getAuthorizationURL(redirectURI)
  }

  @Mutation(() => Boolean)
  async updateSpotifyAuth(
    @Args('code') code: string,
    @Args('redirectURI') redirectURI: string,
  ): Promise<boolean> {
    await this.service.requestAndSaveTokens(code, redirectURI)
    return true
  }

  @Query(() => Track, { nullable: true })
  getCurrentTrack() {
    return this.service.currentTrack
  }

  @Subscription(() => Track, { nullable: true, resolve: (payload) => payload })
  currentTrackUpdated() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(Topics.CURRENT_TRACK, this.service.currentTrack),
    )
    return this.pubsub.asyncIterator(Topics.CURRENT_TRACK)
  }

  @Subscription(() => Int, { nullable: true, resolve: identity })
  currentTrackProgress() {
    return this.pubsub.asyncIterator(Topics.PROGRESS)
  }
  @Query(() => String, { nullable: true })
  async getSpotifyUserName() {
    return (await this.service.getCurrentUser())?.display_name
  }
}
