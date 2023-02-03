import { Injectable, Logger } from '@nestjs/common';
import {
  ApiClient,
  HelixChannelUpdate,
  HelixPrivilegedUser,
} from '@twurple/api';
import {
  AccessToken,
  ClientCredentialsAuthProvider,
  exchangeCode,
  RefreshingAuthProvider,
} from '@twurple/auth';
import { EventSubListener } from '@twurple/eventsub';
import { PubSub } from 'graphql-subscriptions';
import { EnvironmentService } from 'src/env.service';
import { RedisService } from 'src/redis.service';

enum RedisKeys {
  TOKEN = 'twitch:token',
}

@Injectable()
export class TwitchService {
  #appAuth = new ClientCredentialsAuthProvider(
    this.env.TWITCH_CLIENT_ID,
    this.env.TWITCH_CLIENT_SECRET,
  );
  appAPI = new ApiClient({
    authProvider: this.#appAuth,
  });
  #listener: EventSubListener | undefined;
  userAuth: RefreshingAuthProvider | undefined;
  userAPI: ApiClient | undefined;
  #user: HelixPrivilegedUser | undefined;
  get clientId() {
    return this.env.TWITCH_CLIENT_ID;
  }

  private readonly logger = new Logger(TwitchService.name);

  constructor(
    private redis: RedisService,
    private pubsub: PubSub,
    private env: EnvironmentService,
  ) {
    this.setupUserAPI();
  }

  async setupUserAPI() {
    if (this.userAuth) return;
    const token = await this.redis.getJSON<AccessToken>(RedisKeys.TOKEN);
    if (!token) return;

    this.userAuth = new RefreshingAuthProvider(
      {
        clientId: this.env.TWITCH_CLIENT_ID,
        clientSecret: this.env.TWITCH_CLIENT_SECRET,
        onRefresh: async (newToken) =>
          await this.redis.setJSON(RedisKeys.TOKEN, newToken),
      },
      token,
    );

    this.userAPI = new ApiClient({ authProvider: this.userAuth });
  }

  // async searchCategories(query: string) {
  //   const results = await this.appAPI.search.searchCategories(query);
  //   return results.data.map((game) =>
  //     Object.assign(new Game(), {
  //       id: game.id,
  //       name: game.name,
  //       image: game.boxArtUrl,
  //     }),
  //   );
  // }

  async setStreamInfo(update: HelixChannelUpdate) {
    const user = await this.getMe();
    if (!user) return;
    this.appAPI.channels.updateChannelInfo(user?.id, update);
  }

  async authFromCode(code: string, redirect_uri: string) {
    const token = await exchangeCode(
      this.env.TWITCH_CLIENT_ID,
      this.env.TWITCH_CLIENT_SECRET,
      code,
      redirect_uri,
    );
    await this.redis.setJSON(RedisKeys.TOKEN, token);
    await this.setupUserAPI();
  }

  async getMe(force?: boolean) {
    if (this.#user && !force) return this.#user;

    this.#user = await this.userAPI?.users.getMe();
    return this.#user;
  }
}
