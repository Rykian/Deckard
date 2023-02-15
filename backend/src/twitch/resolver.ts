import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import qs from 'qs'
import { EnvironmentService } from 'src/env.service'
import { TwitchChannelInfo } from './object'
import { TwitchService } from './service'

@Resolver()
export class TwitchResolver {
  constructor(
    private service: TwitchService,
    private env: EnvironmentService,
  ) {}
  @Query(() => String)
  getTwitchAuthURL(
    @Args('redirectURI', { defaultValue: 'http://localhost:3000/admin/oauth' })
    redirectURI: string,
  ) {
    const scopes = ['chat:read', 'chat:edit', 'channel:manage:broadcast']
    const clientId = this.env.TWITCH_CLIENT_ID
    const responseType = 'code'

    return (
      `https://id.twitch.tv/oauth2/authorize?` +
      qs.stringify({
        client_id: clientId,
        redirect_uri: redirectURI,
        response_type: responseType,
        scope: scopes.join(' '),
      })
    )
  }

  // @Query(() => [Game])
  // searchCategory(@Args('query') query: string): Promise<Game[]> {
  //   return this.service.searchCategories(query);
  // }

  @Mutation(() => Boolean)
  async updateTwitchTokenFromCode(
    @Args('code') code: string,
    @Args('redirectURI') redirectURI: string,
  ) {
    await this.service.authFromCode(code, redirectURI)
    return true
  }

  @Query(() => String, {
    nullable: true,
    deprecationReason:
      'Switching query naming scheme, use `twitchGetUsername` instead',
  })
  async getTwitchUserName() {
    return (await this.service.getMe())?.displayName
  }

  @Query(() => String, { nullable: true })
  async getTwitchEditStreamInfoUrl() {
    const user = await this.service.getMe()
    if (!user) return

    return `https://dashboard.twitch.tv/popout/u/${user.name}/stream-manager/edit-stream-info?uuid=${user.id}`
  }

  @Query(() => String, { nullable: true })
  twitchGetClientId() {
    return this.service.clientId
  }

  @Query(() => TwitchChannelInfo)
  async twitchGetChannelInfo(): Promise<TwitchChannelInfo> {
    const channelInfos = await this.service.getChannel()
    const data = {
      category: (await channelInfos.getGame()).name,
      title: channelInfos.title,
    }
    console.log({ data })
    return Object.assign(new TwitchChannelInfo(), data)
  }

  @Query(() => String)
  async twitchGetUsername() {
    return (await this.service.getMe())?.displayName
  }
}
