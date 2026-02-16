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
  TWITCH_APP_REDIRECT_URI = this.env
    .get('TWITCH_APP_REDIRECT_URI')
    .required()
    .asString()
  TWITCH_NAME = this.env.get('TWITCH_NAME').required().asString()
  PORT = this.env.get('PORT').default('3000').asPortNumber()

  CLOUDFLARE_TUNNEL_TOKEN = this.env
    .get('CLOUDFLARE_TUNNEL_TOKEN')
    .required()
    .asString()
  CLOUDFLARE_CUSTOM_DOMAIN = this.env
    .get('CLOUDFLARE_CUSTOM_DOMAIN')
    .required()
    .asString()

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
