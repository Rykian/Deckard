import { Injectable, Logger } from '@nestjs/common'
import type { HelixChannelUpdate, HelixUser } from '@twurple/api'
import { ApiClient } from '@twurple/api'
import {
  AccessToken,
  AppTokenAuthProvider,
  exchangeCode,
  RefreshingAuthProvider,
} from '@twurple/auth'
import { EnvironmentService } from '../env.service'
import { RedisService } from '../redis.service'
import { TwitchCategory, TwitchChannelInfo } from './object'
import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'
import { TwitchEvents } from './event.service'
import { OBSStreamService } from '../obs/stream.service'

enum RedisKeys {
  TOKEN = 'twitch:token',
}

@Injectable()
export class TwitchService extends (EventEmitter as new () => TypedEmitter<TwitchEvents>) {
  #appAuth = new AppTokenAuthProvider(
    this.env.TWITCH_CLIENT_ID,
    this.env.TWITCH_CLIENT_SECRET,
  )
  appAPI = new ApiClient({
    authProvider: this.#appAuth,
  })
  userAuth: RefreshingAuthProvider | undefined
  userAPI: ApiClient | undefined
  #user: HelixUser | null | undefined
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
    if (this.userAuth) {
      this.logger.debug('userAuth already set up, skipping')
      return
    }

    const token = await this.redis.getJSON<AccessToken>(RedisKeys.TOKEN)
    if (!token) {
      this.logger.warn(
        'No Twitch token found in Redis. User needs to authenticate.',
      )
      return
    }

    this.logger.log('Setting up Twitch user authentication')
    this.userAuth = new RefreshingAuthProvider({
      clientId: this.env.TWITCH_CLIENT_ID,
      clientSecret: this.env.TWITCH_CLIENT_SECRET,
    })

    // v7 uses EventEmitter pattern with onRefresh event
    this.userAuth.onRefresh(async (userId: string, newToken: AccessToken) => {
      this.logger.log(`Token refreshed for user ${userId}`)
      await this.redis.setJSON(RedisKeys.TOKEN, newToken)
    })

    // Add user to the provider with their token
    await this.userAuth.addUserForToken(token)
    this.logger.debug('User token added to auth provider')

    this.userAPI = new ApiClient({ authProvider: this.userAuth })
    await this.getMe(true)

    if (this.me) {
      await this.fillInfosFromAPI()
    } else {
      this.logger.error(
        'Failed to authenticate Twitch user after setting up auth provider',
      )
    }
  }

  async fillInfosFromAPI() {
    if (!this.userAPI) {
      this.logger.error('Cannot fill channel info: userAPI not available')
      throw new TwitchServiceError('userAPI not available')
    }
    if (!this.me) {
      this.logger.error(
        'Cannot fill channel info: Current user not available. Make sure Twitch authentication completed successfully.',
      )
      throw new TwitchServiceError('Current user not available')
    }

    this.logger.debug(`Fetching channel info for user: ${this.me.displayName}`)
    const response = await this.userAPI.channels.getChannelInfoById(this.me)
    if (!response) {
      this.logger.error('Channel information response is empty')
      throw new TwitchServiceError('Channel informations are empty')
    }

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
    if (!this.infos) throw new TwitchServiceError('Infos should be present')
    if (this.infos?.category.id == category.id) return

    this.infos = { ...this.infos, category: category }
    this.emit('CategoryUpdated', category)
  }

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

    if (!this.userAPI) {
      this.logger.warn('userAPI not available, cannot fetch user')
      return null
    }

    try {
      this.#user = await this.userAPI.users.getUserByName(this.env.TWITCH_NAME)
      this.logger.log(
        `Authenticated as Twitch user: ${this.#user?.displayName} (${this.#user?.id})`,
      )
    } catch (error) {
      this.logger.error('Failed to get authenticated Twitch user', error)
      this.#user = null
    }

    return this.#user
  }

  private get me() {
    return this.#user
  }

  getChannel() {
    if (!this.userAPI) throw new TwitchServiceError('userAPI not available')
    if (!this.me) throw new TwitchServiceError('User not set')

    return this.userAPI.channels.getChannelInfoById(this.me)
  }

  get isStreaming() {
    return this.obs.isStreaming
  }

  updateTitle = async (title: string) => {
    if (!this.userAPI) throw new TwitchServiceError('userAPI not available')
    if (!this.me) throw new TwitchServiceError('User not set')

    await this.userAPI.channels.updateChannelInfo(this.me, { title })
    this.logger.debug(`Stream title updated to: "${title}"`)
  }

  createMarker = async (title: string) => {
    if (this.isStreaming) {
      if (!this.userAPI) throw new TwitchServiceError('userAPI not available')
      if (!this.me) throw new TwitchServiceError('User not set')

      await this.userAPI.streams.createStreamMarker(this.me, title)
      this.logger.debug(`New marker: "${title}"`)
    } else {
      this.logger.debug(`Stream offline, marker "${title}" not created`)
    }
  }
}

class TwitchServiceError extends Error {}
