import { Injectable, Logger } from '@nestjs/common'
import { TwitchService } from 'src/twitch/service'
import { WoWLogEventService } from './logevent.service'

@Injectable()
export class WoWService {
  previousTitle?: string
  private logger = new Logger(WoWService.name)

  constructor(private twitch: TwitchService, private logs: WoWLogEventService) {
    console.log({ category: this.twitch.infos?.category })
    this.handleCategoryChange()
    twitch.on('CategoryUpdated', this.handleCategoryChange)
    console.log({ logs })
  }

  handleCategoryChange = async () => {
    if (this.twitch?.infos?.category?.name == 'World of Warcraft') {
      this.logs.start()
      this.logs.on('mythicDungeonStart', (event) => {
        this.previousTitle = this.twitch.infos.title
        return this.updateTitle(`${event.zone} +${event.keystoneLevel}`)
      })

      this.logs.on('mythicDungeonEnd', () =>
        this.updateTitle(this.previousTitle || 'Chill'),
      )
    } else {
      this.logs.stop()
    }
  }

  updateTitle = async (title: string) => {
    const user = await this.twitch.getMe()
    await this.twitch.userAPI.channels.updateChannelInfo(user, { title })
    await this.twitch.userAPI.streams.createStreamMarker(user, title)
    this.logger.debug('Stream title updated to: ' + title)
  }
}
