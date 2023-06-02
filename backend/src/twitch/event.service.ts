import { Injectable, Logger } from '@nestjs/common'
import { EventSubListener, ReverseProxyAdapter } from '@twurple/eventsub'
import getPort from 'get-port'
import * as ngrok from 'ngrok'
import { EnvironmentService } from 'src/env.service'
import { TwitchCategory } from './object'
import { TwitchService } from './service'

export type TwitchEvents = {
  CategoryUpdated: (event: TwitchCategory) => void
}

@Injectable()
export class TwitchEventService {
  private logger = new Logger(TwitchEventService.name)
  #listener: EventSubListener
  constructor(private service: TwitchService, private env: EnvironmentService) {
    this.start()
  }

  async start() {
    const port = await getPort()
    const url = new URL(
      await ngrok.connect({
        addr: port,
        authtoken: this.env.NGROK_AUTH_TOKEN,
        // onLogEvent: (event) => this.logger.debug(event),
      }),
    )
    const adapter = new ReverseProxyAdapter({ hostName: url.hostname, port })
    this.#listener = new EventSubListener({
      apiClient: this.service.appAPI,
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

    this.#listener.subscribeToChannelUpdateEvents(user, (event) => {
      if (event.categoryId != this.service.infos?.category.id) return

      const category = new TwitchCategory()
      category.id = event.categoryId
      category.name = event.categoryName

      this.service.setCategory(category)
    })
  }
}
