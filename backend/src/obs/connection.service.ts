import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from 'src/redis.service'
import { OBSAPI } from './_.service'
import { PubSub } from 'graphql-subscriptions'
import { PortScannerService } from 'src/port-scanner.service'

export enum Topics {
  INSTANCE_UPDATED = 'INSTANCE_UPDATED',
}

@Injectable()
export class OBSConnectionService {
  readonly CURRENT_INSTANCE = 'CURRENT_INSTANCE'
  logger = new Logger(OBSConnectionService.name)
  #host: string
  #port: string
  #password?: string
  #protocol: 'wss://' | 'ws://' = 'wss://'
  #connected: boolean
  get connected() {
    return this.#connected
  }
  #interval?: NodeJS.Timer

  constructor(
    private api: OBSAPI,
    private redis: RedisService,
    private pubsub: PubSub,
    private portScanner: PortScannerService,
  ) {
    api.on('Identified', () => {
      this.logger.debug('Connected to OBS')

      clearInterval(this.#interval)
      this.#interval = undefined

      // Store credentials
      if (this.url) this.redis.client.set('last_connection_url', this.url)
      if (this.#password)
        this.redis.client.set('last_connection_password', this.#password)

      this.pubsub.publish(Topics.INSTANCE_UPDATED, this.url)
      this.#connected = true
    })

    api.on('ConnectionClosed', () => {
      this.logger.debug('Disconnected from OBS')
      this.pubsub.publish(Topics.INSTANCE_UPDATED, undefined)
      this.#connected = false
      if (!this.#interval)
        this.#interval = setInterval(() => this.restoreConnection(), 10_000)
    })
    api.on('ConnectionError', this.logger.error)

    this.restoreConnection()
  }

  get url(): string | undefined {
    if (!this.#protocol || !this.#host || !this.#port) return undefined

    return `${this.#protocol}${this.#host}:${this.#port}`
  }

  private set url(url: string | undefined) {
    if (!url) return

    const parsed = new URL(url)
    this.#protocol = (parsed.protocol + '//') as 'wss://' | 'ws://'
    this.#host = parsed.hostname
    this.#port = parsed.port
  }

  connect(host = 'localhost', port = '4455', password?: string) {
    this.#host = host
    this.#port = port
    this.#password = password
    this.#protocol = 'ws://'
    return this.connection()
  }

  private async restoreConnection() {
    this.url = (await this.redis.client.get('last_connection_url')) || undefined
    if (!this.url) return

    await this.connection().catch(() =>
      this.logger.error('Connection failed, retrying in 10s'),
    )
  }

  async connection() {
    if (this.#connected) {
      await this.api.disconnect()
    }
    return new Promise<OBSAPI>((resolve, reject) => {
      this.api.once('ConnectionError', reject)
      this.api.once('Identified', () => {
        this.api.removeListener('ConnectionError', reject)
        resolve(this.api)
      })
      this.api.connect(this.url, this.#password).catch(reject)
    })
  }

  listNetworkOBSInstances() {
    return this.portScanner.list(4455)
  }
}
