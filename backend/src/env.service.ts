import { Logger } from '@nestjs/common'
import { from } from 'env-var'

export class EnvironmentService {
  private logger = new Logger(EnvironmentService.name)
  env = from(process.env)
  TWITCH_CLIENT_ID = this.env.get('TWITCH_CLIENT_ID').required().asString()
  TWITCH_CLIENT_SECRET = this.env
    .get('TWITCH_CLIENT_SECRET')
    .required()
    .asString()
  TWITCH_SECRET = this.env.get('TWITCH_SECRET').required().asString()
  TUNNEL_SUBDOMAIN = this.env.get('TUNNEL_SUBDOMAIN').required().asString()

  SPOTIFY_CLIENT_ID = this.env.get('SPOTIFY_CLIENT_ID').required().asString()
  SPOTIFY_CLIENT_SECRET = this.env
    .get('SPOTIFY_CLIENT_SECRET')
    .required()
    .asString()

  SCENE_START = this.env.get('SCENE_START').default('Start').asString()
  SCENE_STOP = this.env.get('SCENE_STOP').default('Stop').asString()
  SCENE_PAUSE = this.env.get('SCENE_PAUSE').default('Pause').asString()

  constructor() {
    this.logger.debug('Initilized')
  }
}
