import { Injectable } from '@nestjs/common'
import EventEmitter from 'events'
import { OBSWebSocketError } from 'obs-websocket-js'
import { setTimeout } from 'timers/promises'
import TypedEventEmitter from 'typed-emitter'
import { CheckScenesReport, ItemReport } from './scenes.object'
import { OBSAPI } from './_.service'

const REQUIRED_OBJECTS = {
  main: ['webcam', 'capture'],
  chatting: ['webcam'],
}

interface OBSSceneChangedEvent {
  scene: string
}

type Events = {
  sceneChanged: (event: OBSSceneChangedEvent) => void
}

@Injectable()
export class OBSScenesService extends (EventEmitter as new () => TypedEventEmitter<Events>) {
  #programScene: string
  #previewScene: string
  #availableScenes: string[]
  get programScene() {
    return this.#programScene
  }
  get previewScene() {
    return this.#previewScene
  }
  get availableScenes() {
    return this.#availableScenes
  }

  constructor(private api: OBSAPI) {
    super()
    api.on('CurrentProgramSceneChanged', ({ sceneName }) => {
      this.#programScene = sceneName
      this.emit('sceneChanged', { scene: sceneName })
    })
    api.on(
      'CurrentPreviewSceneChanged',
      ({ sceneName }) => (this.#previewScene = sceneName),
    )
    api.on(
      'SceneListChanged',
      (e) =>
        (this.#availableScenes = e.scenes.map((s) => s['sceneName'] as string)),
    )
    api.on('Identified', async () => {
      try {
        this.#previewScene = (
          await api.call('GetCurrentPreviewScene')
        ).currentPreviewSceneName
      } catch (e) {
        if (!(e instanceof OBSWebSocketError) || e.code != 506) throw e
      }
      this.#programScene = (
        await api.call('GetCurrentProgramScene')
      ).currentProgramSceneName
      this.#availableScenes = (await api.call('GetSceneList')).scenes.map(
        (s) => s['sceneName'] as string,
      )
    })
  }

  async switchScene(name: string, instant = true) {
    if (!instant) {
      await this.api.call('SetStudioModeEnabled', { studioModeEnabled: true })
      await this.api.call('SetCurrentPreviewScene', { sceneName: name })
      await setTimeout(1_000)
    }
    return this.api.call('SetCurrentProgramScene', { sceneName: name })
  }

  async checkScenes() {
    const report = new CheckScenesReport()

    await Promise.all(
      Object.entries(REQUIRED_OBJECTS).map(async ([scene, sources]) => {
        try {
          const items = await this.api.call('GetSceneItemList', {
            sceneName: scene,
          })
          const sourcesNames = items.sceneItems.map(
            (item) => item['sourceName'],
          )

          const missingSources = sources.filter(
            (source) => !sourcesNames.includes(source),
          )

          if (missingSources.length) {
            const itemReport = new ItemReport()
            itemReport.items = missingSources
            itemReport.scene = scene
            report.missingItems ||= []
            report.missingItems.push(itemReport)
            console.error(
              `Missing sources on scene "${scene}":`,
              ...missingSources,
            )
          }
        } catch (err) {
          if (err instanceof OBSWebSocketError) {
            if (err.code == 600) {
              // Source not found
              report.missingScenes ||= []
              report.missingScenes.push(scene)
              console.error(err.message)
            } else throw err
          }
        }
      }),
    )

    return report
  }

  enableStudioMode() {
    return this.api.call('SetStudioModeEnabled', { studioModeEnabled: true })
  }
}
