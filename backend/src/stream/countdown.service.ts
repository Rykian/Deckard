import { Injectable, Logger } from '@nestjs/common'
import { differenceInMilliseconds, isFuture } from 'date-fns'
import EventEmitter from 'events'
import { PubSub } from 'graphql-subscriptions'
import TypedEventEmitter from 'typed-emitter'

export enum Topics {
  COUNTDOWN_EXPIRED = 'countdown:expired',
  COUNTDOWN_UPDATED = 'countdown:updated',
}

export interface StreamCountdownExpired {
  name: string
}

type Events = {
  streamCountdownExpired: (event: StreamCountdownExpired) => void
}

@Injectable()
export class StreamCountdownService extends (EventEmitter as new () => TypedEventEmitter<Events>) {
  logger = new Logger(StreamCountdownService.name)
  #countdowns: Record<string, Date> = {}

  constructor(private pubsub: PubSub) {
    super()
    setInterval(this.check, 20_000)
  }

  set(name: string, target: Date) {
    this.logger.debug(`Setting up a new countdown "${name}" for ${target}`)
    this.#countdowns[name] = target
    this.pubsub.publish(Topics.COUNTDOWN_UPDATED, {
      name,
      target: target.toISOString(),
    })
    setTimeout(this.check, differenceInMilliseconds(target, new Date()))
  }

  get(name: string) {
    return this.#countdowns[name]
  }

  private check = () => {
    Object.entries(this.#countdowns).forEach(([name, target]) => {
      if (isFuture(target)) return

      this.logger.debug(`Countdown "${name}" expired`)
      this.emit('streamCountdownExpired', { name })
      this.pubsub.publish(Topics.COUNTDOWN_EXPIRED, name)
    })
  }
}
