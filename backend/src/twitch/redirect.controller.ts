import { Controller, Get, Query, Redirect } from '@nestjs/common'
import qs from 'qs'
import { EnvironmentService } from '../env.service'

@Controller('twitch')
export class TwitchRedirectController {
  constructor(private env: EnvironmentService) {}

  @Get('oauth')
  @Redirect()
  handleRedirect(@Query() query: Record<string, string | string[]>) {
    const appRedirectUri = this.env.TWITCH_APP_REDIRECT_URI
    const queryString = qs.stringify(query)
    const url = queryString
      ? `${appRedirectUri}?${queryString}`
      : appRedirectUri

    return { url }
  }
}
