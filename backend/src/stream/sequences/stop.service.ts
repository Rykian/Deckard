import { Injectable } from '@nestjs/common'
import { addMinutes } from 'date-fns'
import { EnvironmentService } from 'src/env.service'
import { OBSStreamService } from 'src/obs/stream.service'
import { StreamCountdownService } from 'src/stream/countdown.service'
import { OBSScenesService } from '../../obs/scenes.service'

@Injectable()
export class StreamSequencesStopService {
  constructor(
    private countdown: StreamCountdownService,
    private scene: OBSScenesService,
    private stream: OBSStreamService,
    private env: EnvironmentService,
  ) {}

  async stop() {
    this.countdown.once('streamCountdownExpired', this.#kill)
    this.countdown.set('stop', addMinutes(new Date(), 3))
    await this.scene.switchScene(this.env.SCENE_STOP)
  }

  async cancel(scene?: string) {
    this.countdown.off('streamCountdownExpired', this.#kill)
    if (scene) await this.scene.switchScene(scene)
  }

  #kill = () => this.stream.stop()
}
