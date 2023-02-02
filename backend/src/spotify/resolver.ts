import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { SpotifyTrackService, Topics } from './track.service';
import { Track } from './track.model';
import { setTimeout } from 'timers/promises';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class SpotifyResolver {
  constructor(private service: SpotifyTrackService, private pubsub: PubSub) {}
  @Query(() => String)
  getSpotifyAuthURL(@Args('redirectURI') redirectURI: string) {
    return this.service.getAuthorizationURL(redirectURI);
  }

  @Mutation(() => Boolean)
  async updateSpotifyAuth(
    @Args('code') code: string,
    @Args('redirectURI') redirectURI: string,
  ): Promise<boolean> {
    await this.service.requestAndSaveTokens(code, redirectURI);
    return true;
  }

  @Query(() => Track, { nullable: true })
  getCurrentTrack() {
    return this.service.currentTrack;
  }

  @Subscription(() => Track, { nullable: true, resolve: (payload) => payload })
  currentTrackUpdated() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(
        Topics.SPOTIFY_CURRENT_TRACK,
        this.service.currentTrack,
      ),
    );
    return this.service.currentTrackIterator();
  }

  @Query(() => String, { nullable: true })
  async getSpotifyUserName() {
    return (await this.service.getCurrentUser())?.display_name;
  }
}
