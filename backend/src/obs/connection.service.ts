import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from 'src/redis.service'
import { OBSAPI } from './_.service'
import EvilScan from 'evilscan'
import { Instance } from './connection.object'
import { OBSWebSocketError } from 'obs-websocket-js'
import { PubSub } from 'graphql-subscriptions'

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

  constructor(
    private api: OBSAPI,
    private redis: RedisService,
    private pubsub: PubSub,
  ) {}

  get url(): string | undefined {
    if (!this.#protocol || !this.#host || !this.#port) return undefined

    return `${this.#protocol}${this.#host}:${this.#port}`
  }

  onError = (error: OBSWebSocketError) => {
    this.logger.error(error)
    this.pubsub.publish(Topics.INSTANCE_UPDATED, undefined)
  }

  async connect(host = 'localhost', port = '4455', password?: string) {
    this.#host = host
    this.#port = port
    this.#password = password
    this.#protocol = 'ws://'

    this.api.on('Identified', () => {
      this.logger.debug('Identified')
      if (this.url) this.redis.client.set('last_connection_url', this.url)
      if (this.#password)
        this.redis.client.set('last_connection_password', this.#password)
      this.pubsub.publish(Topics.INSTANCE_UPDATED, this.url)
      this.#connected = true
    })

    this.api.on('ConnectionClosed', this.onError)
    this.api.on('ConnectionError', this.onError)

    return await this.connection()
  }

  async connection() {
    if (this.#connected) {
      await this.api.disconnect()
    }
    return new Promise<OBSAPI>((resolve, reject) => {
      const rejectHandler = (err: OBSWebSocketError) => reject(err)
      this.api.on('ConnectionError', rejectHandler)
      this.api.on('ConnectionClosed', rejectHandler)
      this.api.once('Identified', () => {
        this.api.removeListener('ConnectionClosed', rejectHandler)
        this.api.removeListener('ConnectionError', rejectHandler)
        resolve(this.api)
      })
      this.api.connect(this.url, this.#password).catch(rejectHandler)
    })
  }

  async listNetworkOBSInstances() {
    return await new Promise((resolve, reject) => {
      const results: Instance[] = []
      const scan = new EvilScan({
        target: '192.168.1.0/24',
        port: 4455,
        status: 'O',
        reverse: true,
      })
      scan.on(
        'result',
        (data: {
          status: string
          ip: string
          port: string
          reverse: string
        }) => {
          if (data.status == 'open')
            results.push(
              Object.assign(new Instance(), {
                ip: data.ip,
                port: data.port,
                hostname: data.reverse,
              }),
            )
        },
      )

      scan.on('error', (err: object) => {
        reject(err.toString())
      })

      scan.on('done', () => {
        resolve(results)
      })
      scan.run()
    })
  }
}
