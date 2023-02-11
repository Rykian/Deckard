import { Injectable, Logger } from '@nestjs/common'
import {
  ApiClient,
  HelixChannelUpdate,
  HelixPrivilegedUser,
} from '@twurple/api'
import {
  AccessToken,
  ClientCredentialsAuthProvider,
  exchangeCode,
  RefreshingAuthProvider,
} from '@twurple/auth'
import { EnvironmentService } from 'src/env.service'
import { RedisService } from 'src/redis.service'
import { TwitchCategory, TwitchChannelInfo } from './object'
import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'
import { TwitchEvents } from './event.service'
import { OBSStreamService } from 'src/obs/stream.service'

enum RedisKeys {
  TOKEN = 'twitch:token',
}

@Injectable()
export class TwitchService extends (EventEmitter as new () => TypedEmitter<TwitchEvents>) {
  #appAuth = new ClientCredentialsAuthProvider(
    this.env.TWITCH_CLIENT_ID,
    this.env.TWITCH_CLIENT_SECRET,
  )
  appAPI = new ApiClient({
    authProvider: this.#appAuth,
  })
  userAuth: RefreshingAuthProvider | undefined
  userAPI: ApiClient | undefined
  #user: HelixPrivilegedUser | undefined
  get clientId() {
    return this.env.TWITCH_CLIENT_ID
  }

  infos?: TwitchChannelInfo

  private readonly logger = new Logger(TwitchService.name)

  constructor(
    private redis: RedisService,
    private env: EnvironmentService,
    private obs: OBSStreamService,
  ) {
    super()
    this.setupUserAPI()
  }

  async setupUserAPI() {
    if (this.userAuth) return
    const token = await this.redis.getJSON<AccessToken>(RedisKeys.TOKEN)
    if (!token) return

    this.userAuth = new RefreshingAuthProvider(
      {
        clientId: this.env.TWITCH_CLIENT_ID,
        clientSecret: this.env.TWITCH_CLIENT_SECRET,
        onRefresh: async (newToken) =>
          await this.redis.setJSON(RedisKeys.TOKEN, newToken),
      },
      token,
    )

    this.userAPI = new ApiClient({ authProvider: this.userAuth })
    await this.getMe(true)
    await this.fillInfosFromAPI()
  }

  async fillInfosFromAPI() {
    const response = await this.userAPI.channels.getChannelInfoById(this.me)
    const category = {
      id: response.gameId,
      name: response.gameName,
    }

    this.infos = {
      title: response.title,
      category,
    }

    this.emit('CategoryUpdated', category)
  }

  setCategory(category: TwitchCategory) {
    if (this.infos?.category.id == category.id) return

    this.infos = { ...this.infos, category: category }
    this.emit('CategoryUpdated', category)
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
    const user = await this.getMe()
    if (!user) return
    this.appAPI.channels.updateChannelInfo(user?.id, update)
  }

  async authFromCode(code: string, redirect_uri: string) {
    const token = await exchangeCode(
      this.env.TWITCH_CLIENT_ID,
      this.env.TWITCH_CLIENT_SECRET,
      code,
      redirect_uri,
    )
    await this.redis.setJSON(RedisKeys.TOKEN, token)
    await this.setupUserAPI()
  }

  async getMe(force?: boolean) {
    if (this.#user && !force) return this.#user

    this.#user = await this.userAPI?.users.getMe()
    return this.#user
  }

  private get me() {
    return this.#user
  }

  getChannel() {
    return this.userAPI.channels.getChannelInfoById(this.me)
  }

  get isStreaming() {
    return this.obs.isStreaming
  }

  updateTitle = async (title: string) => {
    await this.userAPI.channels.updateChannelInfo(this.me, { title })
    this.logger.debug(`Stream title updated to: "${title}"`)
  }

  createMarker = async (title: string) => {
    if (this.isStreaming) {
      await this.userAPI.streams.createStreamMarker(this.me, title)
      this.logger.debug(`New marker: "${title}"`)
    } else {
      this.logger.debug(`Stream offline, marker "${title}" not created`)
    }
  }
}
