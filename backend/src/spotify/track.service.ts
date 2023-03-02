import { Injectable, Logger } from '@nestjs/common'
import { add, getUnixTime } from 'date-fns'
import { PubSub } from 'graphql-subscriptions'
import SpotifyWebApi from 'spotify-web-api-node'
import { EnvironmentService } from '../env.service'
import { RedisService } from '../redis.service'

import { Track } from './track.model'

enum Redis {
  SPOTIFY_TOKENS = 'spotify:tokens',
  TOKEN_VALID = 'spotify:token_valid',
}

export enum Topics {
  CURRENT_TRACK = 'spotify:current_track',
  PROGRESS = 'spotify:current_track:progress',
}

interface AuthorizationCodeGrantResponse {
  access_token: string
  expires_in: number
  refresh_token?: string | undefined
  scope: string
  token_type: string
}

export type SpotifyTrack = SpotifyApi.CurrentlyPlayingResponse & {
  item: SpotifyApi.TrackObjectFull
}

@Injectable()
export class SpotifyTrackService {
  private logger = new Logger(SpotifyTrackService.name)
  #api: SpotifyWebApi = new SpotifyWebApi({
    clientId: this.env.SPOTIFY_CLIENT_ID,
    clientSecret: this.env.SPOTIFY_CLIENT_SECRET,
  })

  #interval: NodeJS.Timer | undefined
  #currentTrack: Track | null = null
  get currentTrack() {
    return this.#currentTrack
  }

  set currentTrack(track: Track | null) {
    if (track == this.#currentTrack) return

    if (!track) {
      this.logger.debug('Paused')
      this.pubsub.publish(Topics.CURRENT_TRACK, track)
      this.pubsub.publish(Topics.PROGRESS, null)
    } else if (track?.id != this.#currentTrack?.id) {
      this.logger.debug(
        `Track changed: ${track.name} (${track.album}) - ${track.artists}`,
      )
      this.pubsub.publish(Topics.CURRENT_TRACK, track)
    }
    this.#currentTrack = track
  }

  constructor(
    private redis: RedisService,
    private pubsub: PubSub,
    private env: EnvironmentService,
  ) {
    this.init()
  }

  async init() {
    const tokens = await this.getTokens()
    if (tokens) {
      this.logger.debug('Tokens found.')
      this.#api.setAccessToken(tokens.access_token)
      if (tokens.refresh_token) this.#api.setRefreshToken(tokens.refresh_token)
    } else {
      this.logger.debug('Tokens not found. Getting new app access token.')
      const token = (await this.#api.clientCredentialsGrant()).body
      if (!token) return
      this.#api.setAccessToken(token.access_token)
    }
    this.startTrackPolling()
    // this.pubsub.subscribe(STREAM_STATE, (state: any) => {
    //   if (state && state != StreamState.STOPPED) {
    //     this.startTrackPolling();
    //   } else {
    //     this.stopTrackPolling();
    //   }
    // });
  }

  startTrackPolling() {
    if (this.#interval) return

    this.logger.log('Polling track changes')

    this.#interval = setInterval(async () => {
      const data = await this.getCurrentTrack()
      if (!data) return (this.currentTrack = null)

      this.currentTrack = new Track(data.item)
      this.pubsub.publish(Topics.PROGRESS, data.progress_ms)
    }, 3000)
  }

  stopTrackPolling() {
    this.logger.log('Stop polling tracks')
    if (!this.#interval) return

    clearTimeout(this.#interval)
    this.#interval = undefined
  }

  async getTokens() {
    if (!(await this.redis.exists(Redis.SPOTIFY_TOKENS))) return
    return (await this.redis.getJSON(
      Redis.SPOTIFY_TOKENS,
    )) as unknown as AuthorizationCodeGrantResponse
  }

  async setTokens(tokens: AuthorizationCodeGrantResponse) {
    await this.redis.setJSON(Redis.SPOTIFY_TOKENS, tokens)
    const expirationDate = add(new Date(), {
      seconds: tokens.expires_in,
    })
    await this.redis.set(Redis.TOKEN_VALID, 'true', {
      EXAT: getUnixTime(expirationDate),
    })
    this.#api.setAccessToken(tokens.access_token)
    if (tokens.refresh_token) this.#api.setRefreshToken(tokens.refresh_token)
  }

  async isTokenValid() {
    return (await this.redis.exists(Redis.TOKEN_VALID)) == 1
  }

  async renewTokenIfNeeded() {
    if (await this.isTokenValid()) return
    this.logger.log('Renewing token...')
    const tokens = await this.getTokens()
    if (!tokens) return

    await this.setTokens(tokens)
    const newTokens = await this.#api.refreshAccessToken()
    await this.setTokens({ ...tokens, ...newTokens.body })
    this.init()
  }

  async requestAndSaveTokens(code: string, redirectURI: string) {
    this.#api.setRedirectURI(redirectURI)
    const response = await this.#api.authorizationCodeGrant(code)
    await this.setTokens(response.body)
  }

  async getCurrentTrack() {
    await this.renewTokenIfNeeded()
    let response: SpotifyApi.CurrentlyPlayingResponse
    try {
      response = (await this.#api.getMyCurrentPlayingTrack()).body
    } catch (e) {
      this.logger.error('Error when getting current track', e)
      return null
    }
    if (!response.is_playing) return null
    if (response.item?.type != 'track') return null

    return response as SpotifyTrack
  }

  getAuthorizationURL(redirectURI: string) {
    this.#api.setRedirectURI(redirectURI)
    return this.#api.createAuthorizeURL(['user-read-playback-state'], '')
  }

  async getCurrentUser() {
    try {
      await this.renewTokenIfNeeded()
      return (await this.#api.getMe()).body
    } catch (error) {
      this.logger.debug('Not connected, no user to return')
    }
  }
}
