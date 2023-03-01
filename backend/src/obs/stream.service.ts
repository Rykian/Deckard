import { Injectable, Logger } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { EventEmitter } from 'stream'
import { setTimeout } from 'timers/promises'
import TypedEventEmitter from 'typed-emitter'
import { OBSAPI } from './_.service'

export interface OBSStreamStreamingChangedEvent {
  streaming: boolean
}

type Events = {
  streamingChanged: (event: OBSStreamStreamingChangedEvent) => void
}

@Injectable()
export class OBSStreamService extends (EventEmitter as new () => TypedEventEmitter<Events>) {
  logger = new Logger(OBSStreamService.name)
  readonly IS_STREAMING = 'IS_STREAMING'

  #streaming = false

  get isStreaming() {
    return this.#streaming
  }

  private set isStreaming(streaming: boolean) {
    if (this.#streaming == streaming) return

    this.#streaming = streaming
    this.pubsub.publish(this.IS_STREAMING, streaming)
  }

  constructor(private api: OBSAPI, private pubsub: PubSub) {
    super()

    api.on('StreamStateChanged', (data) => {
      this.logger.debug(`Stream state change: ${JSON.stringify(data)}`)
      this.isStreaming = data.outputActive
      this.emit('streamingChanged', { streaming: this.isStreaming })
    })
    if (api.identified) {
      this.checkCurrentState()
    } else {
      api.on('Hello', async () => {
        await setTimeout(1000)
        this.checkCurrentState()
      })
    }
  }

  async checkCurrentState() {
    const data = await this.api.call('GetStreamStatus')
    this.isStreaming = data.outputActive
  }

  async start() {
    await this.api.call('StartStream')
  }
  async stop() {
    await this.api.call('StopStream')
  }
}
