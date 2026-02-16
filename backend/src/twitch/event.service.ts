import { Injectable, Logger } from '@nestjs/common'
import { EventSubWsListener } from '@twurple/eventsub-ws'
import { EnvironmentService } from 'src/env.service'
import { TwitchCategory } from './object'
import { TwitchService } from './service'

export type TwitchEvents = {
  CategoryUpdated: (event: TwitchCategory) => void
}

@Injectable()
export class TwitchEventService {
  private logger = new Logger(TwitchEventService.name)
  #listener: EventSubWsListener
  constructor(
    private service: TwitchService,
    private env: EnvironmentService,
  ) {
    this.start()
  }

  async start() {
    this.#listener = new EventSubWsListener({
      apiClient: this.service.appAPI as any,
    })
    await this.eventSub()
    this.#listener.start()
    this.logger.debug('EventSub WebSocket listener started')
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
