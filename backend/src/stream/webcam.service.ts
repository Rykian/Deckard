import { Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { OBSAPI } from 'src/obs/_.service'

export enum Topics {
  VISIBILITY = 'stream:webcam:visibility',
}

@Injectable()
export class StreamWebcamService {
  webcamItemId?: number
  #enabled = false
  readonly overlayScene = '_overlays'

  public get enabled() {
    return this.#enabled
  }
  private set enabled(enabled) {
    this.#enabled = enabled
    this.pubsub.publish(Topics.VISIBILITY, enabled)
  }

  constructor(private api: OBSAPI, private pubsub: PubSub) {
    this.api.on('Identified', this.findWebcamItemId)
    this.api.on('SceneItemEnableStateChanged', (event) => {
      if (
        event.sceneName == this.overlayScene &&
        event.sceneItemId == this.webcamItemId
      ) {
        this.enabled = event.sceneItemEnabled
      }
    })
  }

  findWebcamItemId = async () => {
    const items = await this.api.call('GetSceneItemList', {
      sceneName: this.overlayScene,
    })
    const webcamItem = items.sceneItems.find((item) =>
      (item['sourceName'] as string).includes('webcam'),
    )
    if (!webcamItem) return

    this.webcamItemId = webcamItem['sceneItemId'] as number | undefined
    this.enabled = !!webcamItem['sceneItemEnabled']
    return this.webcamItemId
  }

  async toggle() {
    if (!this.webcamItemId) return

    const sceneItemEnabled = !this.enabled

    await this.api.call('SetSceneItemEnabled', {
      sceneItemEnabled,
      sceneItemId: this.webcamItemId,
      sceneName: this.overlayScene,
    })
    return sceneItemEnabled
  }
}
