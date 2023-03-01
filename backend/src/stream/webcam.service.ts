import { Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { setTimeout } from 'timers/promises'
import { EnvironmentService } from '../env.service'
import { OBSAPI } from '../obs/_.service'

export enum Topics {
  VISIBILITY = 'stream:webcam:visibility',
  BLUR = 'stream:webcam:blur',
}

@Injectable()
export class StreamWebcamService {
  itemId?: number
  #visible = false
  #blured = false

  readonly scene = '_maincam'
  readonly source = 'webcam'
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
      if (e.sceneName != this.scene) return
      if (e.sceneItemId != this.itemId) return

      this.visible = e.sceneItemEnabled
    })
    this.api.on('SourceFilterEnableStateChanged', (e) => {
      if (e.sourceName != this.source) return
      if (!e.filterName.startsWith('blur_')) return

      this.blured = e.filterEnabled
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
      (item['sourceName'] as string).includes(this.source),
    )

    if (!item) throw new StreamWebcamError(this.source, this.scene)

    this.itemId = item['sceneItemId'] as number | undefined

    this.visible = !!item['sceneItemEnabled']
    this.blured = (
      await this.api.call('GetSourceFilterList', { sourceName: this.source })
    ).filters.some((v) => v['filterEnabled'])
  }

  async setVisible(visible: boolean) {
    if (!this.itemId) return

    return this.setVisiblility(this.itemId, visible)
  }
  toggle = () => this.setVisible(!this.visible)

  async setBlur(blur: boolean) {
    const { filters } = await this.api.call('GetSourceFilterList', {
      sourceName: this.source,
    })

    const blurs = filters.filter((filter) =>
      (filter['filterName'] as string).includes('blur_'),
    )

    if (!blur) blurs.reverse()

    for (const filter of blurs) {
      await this.api.call('SetSourceFilterEnabled', {
        sourceName: this.source,
        filterName: filter['filterName'] as string,
        filterEnabled: blur,
      })
      await setTimeout(32)
    }
    return blur
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
