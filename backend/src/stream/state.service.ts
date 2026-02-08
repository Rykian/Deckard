import { Injectable, Logger } from '@nestjs/common'
import { registerEnumType } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { EnvironmentService } from 'src/env.service'
import { OBSScenesService } from 'src/obs/scenes.service'
import { OBSStreamService } from 'src/obs/stream.service'

export enum State {
  offline = 'offline',
  starting = 'starting',
  streaming = 'streaming',
  pausing = 'pausing',
  stopping = 'stopping',
}

registerEnumType(State, { name: 'StreamStateEnum' })

export enum Topics {
  CHANGED = 'stream:state:changed',
}

@Injectable()
export class StreamStateService {
  logger = new Logger(StreamStateService.name)
  #_state?: State

  set #state(sequence: State) {
    if (this.#_state == sequence) return

    this.#_state = sequence
    this.pubsub.publish(Topics.CHANGED, sequence)
    this.logger.debug(`changed: ${this.state}`)
  }

  get state() {
    return this.#_state
  }

  constructor(
    private stream: OBSStreamService,
    private scene: OBSScenesService,
    private pubsub: PubSub,
    private env: EnvironmentService,
  ) {
    this.#state = this.resolveCurrentState()
    stream.on(
      'streamingChanged',
      () => (this.#state = this.resolveCurrentState()),
    )
    scene.on('sceneChanged', () => (this.#state = this.resolveCurrentState()))
  }

  resolveCurrentState = (): State => {
    if (!this.stream.isStreaming) return State.offline
    switch (this.scene.programScene) {
      case this.env.SCENE_START:
        return State.starting
      case this.env.SCENE_PAUSE:
        return State.pausing
      case this.env.SCENE_STOP:
        return State.stopping
    }
    return State.streaming
  }

  sequenceIterator() {
    return this.pubsub.asyncIterableIterator(Topics.CHANGED)
  }
}
