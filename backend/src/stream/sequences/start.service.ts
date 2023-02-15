import { Injectable, Logger } from '@nestjs/common'
import { OBSWebSocketError } from 'obs-websocket-js'
import { EnvironmentService } from 'src/env.service'
import { OBSStreamService } from 'src/obs/stream.service'
import {
  StreamCountdownExpired,
  StreamCountdownService,
} from 'src/stream/countdown.service'
import { OBSScenesService } from '../../obs/scenes.service'

@Injectable()
export class StreamSequencesStartService {
  logger = new Logger(StreamSequencesStartService.name)
  scene?: string
  constructor(
    private scenes: OBSScenesService,
    private countdown: StreamCountdownService,
    private env: EnvironmentService,
    private obsStream: OBSStreamService,
  ) {}

  async startStreaming(targetedTime?: Date) {
    if (targetedTime) await this.countdown.set('start', targetedTime)
    await this.scenes.switchScene(this.env.SCENE_START)
    await this.scenes.enableStudioMode()
    try {
      await this.obsStream.start()
    } catch (e) {
      // 500: Stream is already running
      if (!(e instanceof OBSWebSocketError) || e.code != 500) throw e
    }
  }

  async startImmediatly(scene: string) {
    await this.scenes.switchScene(scene)
    this.cancelStartOnCountdownExpiring()
  }

  startOnCountdownExpiring(scene: string) {
    this.scene = scene
    this.countdown.on('streamCountdownExpired', this.onExpiring)
  }

  cancelStartOnCountdownExpiring() {
    this.scene = undefined
    this.countdown.off('streamCountdownExpired', this.onExpiring)
  }

  toggleStartOnExpiring(scene: string) {
    if (this.scene) {
      this.scene = undefined
      this.countdown.off('streamCountdownExpired', this.onExpiring)
      this.logger.debug("Don't switch on countdown expired")
      return false
    } else {
      this.scene = scene
      this.countdown.on('streamCountdownExpired', this.onExpiring)
      this.logger.debug('Switch on countdown expired')
      return true
    }
  }

  onExpiring = async (event: StreamCountdownExpired) => {
    console.log('onExpiring', event)
    if (event.name != 'start') return

    await this.scenes.switchScene(this.scene ?? 'default')
  }
}
