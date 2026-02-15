import { Injectable, Logger } from '@nestjs/common'
import {
  EventSubHttpListener,
  ReverseProxyAdapter,
} from '@twurple/eventsub-http'
import { EnvironmentService } from 'src/env.service'
import { TunnelDomainService, getHostnameFromUrl } from 'src/tunnel'
import { TwitchCategory } from './object'
import { TwitchService } from './service'

export type TwitchEvents = {
  CategoryUpdated: (event: TwitchCategory) => void
}

@Injectable()
export class TwitchEventService {
  private logger = new Logger(TwitchEventService.name)
  #listener: EventSubHttpListener
  constructor(
    private service: TwitchService,
    private env: EnvironmentService,
    private tunnelService: TunnelDomainService,
  ) {
    this.start()
  }

  async start() {
    const tunnel = await this.tunnelService.establishTunnel()
    this.logger.debug(`Tunnel URL: ${tunnel.url}`)
    const adapter = new ReverseProxyAdapter({
      hostName: getHostnameFromUrl(tunnel.url),
      port: tunnel.port,
    })
    this.#listener = new EventSubHttpListener({
      apiClient: this.service.appAPI as any,
      adapter,
      secret: this.env.TWITCH_SECRET,
      strictHostCheck: true,
    })
    await this.eventSub()
    await this.#listener.start()
  }

  async eventSub() {
    const user = await this.service.getMe()
    if (!user) return null
    // clear subs
    await this.service.appAPI.eventSub.deleteAllSubscriptions()

    // v7 changed subscribeToChannelUpdateEvents to onChannelUpdate
    this.#listener.onChannelUpdate(user, (event) => {
      if (event.categoryId != this.service.infos?.category.id) return

      const category = new TwitchCategory()
      category.id = event.categoryId
      category.name = event.categoryName

      this.service.setCategory(category)
    })
  }
}
