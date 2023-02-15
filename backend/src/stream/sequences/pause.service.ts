import { Injectable } from '@nestjs/common'
import { EnvironmentService } from 'src/env.service'
import { OBSScenesService } from '../../obs/scenes.service'

@Injectable()
export class StreamSequencesPauseService {
  sceneBeforePause: string
  constructor(
    private scene: OBSScenesService,
    private env: EnvironmentService,
  ) {}

  async pause() {
    this.sceneBeforePause = this.scene.programScene
    await this.scene.switchScene(this.env.SCENE_PAUSE)
    return this.sceneBeforePause
  }

  async unpause(scene?: string) {
    await this.scene.switchScene(scene || this.sceneBeforePause)
  }
}
