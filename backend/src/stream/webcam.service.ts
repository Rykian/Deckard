import { Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { EnvironmentService } from '../env.service'
import { OBSAPI } from '../obs/_.service'

export enum Topics {
  VISIBILITY = 'stream:webcam:visibility',
  BLUR = 'stream:webcam:blur',
}

@Injectable()
export class StreamWebcamService {
  webcamId?: number
  blurredWebcamId?: number
  #visible = false
  #blured = false

  readonly scene = '_maincam'
  readonly blurredItemName = 'webcam-blurred'
  readonly itemName = 'webcam'
  readonly blurredScenes = [
    this.env.SCENE_START,
    this.env.SCENE_PAUSE,
    this.env.SCENE_STOP,
  ]

  public get visible() {
    return this.#visible
  }
  private set visible(status) {
    this.#visible = status
    this.pubsub.publish(Topics.VISIBILITY, status)
  }

  public get blured() {
    return this.#blured
  }
  private set blured(status) {
    this.#blured = status
    this.pubsub.publish(Topics.BLUR, status)
  }

  constructor(
    private api: OBSAPI,
    private pubsub: PubSub,
    private env: EnvironmentService,
  ) {
    this.api.on('Identified', this.assignIds)
    this.api.on('SceneItemEnableStateChanged', (e) => {
      if (e.sceneName == this.scene) return

      switch (e.sceneItemId) {
        case this.webcamId:
          this.visible = e.sceneItemEnabled
          break
        case this.blurredWebcamId:
          this.blured = e.sceneItemEnabled
          break
      }
    })
    this.api.on('CurrentProgramSceneChanged', (e) =>
      this.setBlur(this.blurredScenes.includes(e.sceneName)),
    )
  }

  assignIds = async () => {
    const items = await this.api.call('GetSceneItemList', {
      sceneName: this.scene,
    })
    const item = items.sceneItems.find((item) =>
      (item['sourceName'] as string).includes(this.itemName),
    )

    if (!item) throw new StreamWebcamError(this.itemName, this.scene)

    const blurredItem = items.sceneItems.find((item) =>
      (item['sourceName'] as string).includes(this.blurredItemName),
    )

    if (!blurredItem)
      throw new StreamWebcamError(this.blurredItemName, this.scene)

    this.webcamId = item['sceneItemId'] as number | undefined
    this.blurredWebcamId = blurredItem['sceneItemId'] as number | undefined

    this.visible = !!item['sceneItemEnabled']
    this.blured = !!blurredItem['sceneItemEnabled']
  }

  async setVisible(visible: boolean) {
    if (!this.webcamId) return
    if (!this.blurredWebcamId) return

    if (!visible) await this.setVisiblility(this.blurredWebcamId, visible)
    return this.setVisiblility(this.webcamId, visible)
  }
  toggle = () => this.setVisible(!this.visible)

  async setBlur(blur: boolean) {
    if (!this.blurredWebcamId) return

    return this.setVisiblility(this.blurredWebcamId, blur)
  }
  toggleBlur = () => this.setBlur(!this.blured)

  private setVisiblility = async (sceneItemId: number, visible: boolean) => {
    await this.api.call('SetSceneItemEnabled', {
      sceneItemEnabled: visible,
      sceneItemId,
      sceneName: this.scene,
    })
    return visible
  }
}

export class StreamWebcamError extends Error {
  item: string
  scene: string
  constructor(item: string, scene: string) {
    super(`was expecting an item named ${item} on scene ${scene}`)
    this.item = item
    this.scene = scene
  }
}
