import { Injectable, Logger } from '@nestjs/common'
import { add, getUnixTime } from 'date-fns'
import { PubSub } from 'graphql-subscriptions'
import SpotifyWebApi from 'spotify-web-api-node'
import { EnvironmentService } from 'src/env.service'
import { RedisService } from 'src/redis.service'

import { Track } from './track.model'

enum Redis {
  SPOTIFY_TOKENS = 'spotify:tokens',
  TOKEN_VALID = 'spotify:token_valid',
}

export enum Topics {
  SPOTIFY_CURRENT_TRACK = 'spotify:current_track',
}

interface AuthorizationCodeGrantResponse {
  access_token: string
  expires_in: number
  refresh_token?: string | undefined
  scope: string
  token_type: string
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
      const current = await this.getCurrentTrack()
      if (current?.id != this.#currentTrack?.id) {
        this.logger.debug(
          `Track changed: ${current?.name} (${current?.album}) - ${current?.artists}`,
        )
        this.pubsub.publish(Topics.SPOTIFY_CURRENT_TRACK, current)
        this.#currentTrack = current
      }
    }, 3000)
  }

  stopTrackPolling() {
    this.logger.log('Stop polling tracks')
    if (!this.#interval) return

    clearTimeout(this.#interval)
  }

  async getTokens() {
    if (!(await this.redis.client.exists(Redis.SPOTIFY_TOKENS))) return
    return (await this.redis.getJSON(
      Redis.SPOTIFY_TOKENS,
    )) as unknown as AuthorizationCodeGrantResponse
  }

  async setTokens(tokens: AuthorizationCodeGrantResponse) {
    await this.redis.setJSON(Redis.SPOTIFY_TOKENS, tokens)
    const expirationDate = add(new Date(), {
      seconds: tokens.expires_in,
    })
    await this.redis.client.set(Redis.TOKEN_VALID, 'true', {
      EXAT: getUnixTime(expirationDate),
    })
    this.#api.setAccessToken(tokens.access_token)
    if (tokens.refresh_token) this.#api.setRefreshToken(tokens.refresh_token)
  }

  async isTokenValid() {
    return (await this.redis.client.exists(Redis.TOKEN_VALID)) == 1
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
    const data = response.item

    if (!data) return null
    if (data.type != 'track') return null

    const track = new Track()
    track.album = data.album.name
    track.artists = data.artists.map((artist) => artist.name)
    track.id = data.id
    track.release = data.album.release_date
    track.cover = (
      data.album.images.find((image) => (image.width || 1000) < 600) ||
      data.album.images[0]
    ).url
    track.name = data.name
    track.url = data.external_urls['spotify']

    return track
  }

  currentTrackIterator() {
    return this.pubsub.asyncIterator(Topics.SPOTIFY_CURRENT_TRACK)
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
