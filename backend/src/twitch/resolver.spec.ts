import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { EnvironmentService } from '../env.service'
import { TwitchResolver } from './resolver'
import { TwitchService } from './service'
import { HelixChannel, HelixGame, HelixPrivilegedUser } from '@twurple/api/lib'

describe(TwitchResolver.name, () => {
  let resolver: TwitchResolver
  const envMock = createMock<EnvironmentService>({
    TWITCH_CLIENT_ID: 'test-client-id',
  })
  const twitchServiceMock = createMock<TwitchService>({
    clientId: 'test-client-id',
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwitchResolver,
        { provide: EnvironmentService, useValue: envMock },
        { provide: TwitchService, useValue: twitchServiceMock },
      ],
    }).compile()

    resolver = module.get<TwitchResolver>(TwitchResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe(TwitchResolver.prototype.getTwitchAuthURL.name, () => {
    it('should return an URL', () => {
      const result = resolver.getTwitchAuthURL(
        'http://localhost:3000/admin/oauth',
      )

      const url = new URL(result)
      expect(url.searchParams.get('client_id')).toEqual('test-client-id')
      expect(url.searchParams.get('redirect_uri')).toEqual(
        'http://localhost:3000/admin/oauth',
      )
      expect(url.searchParams.get('response_type')).toEqual('code')
    })
  })

  describe(TwitchResolver.prototype.updateTwitchTokenFromCode.name, () => {
    const code = 'code'
    const redirectURI = 'http://localhost:3000/admin/oauth'

    it('calls service authFromCode', () => {
      resolver.updateTwitchTokenFromCode(code, redirectURI)
      expect(twitchServiceMock.authFromCode).toHaveBeenCalledWith(
        code,
        redirectURI,
      )
    })
  })

  describe(TwitchResolver.prototype.getTwitchUserName.name, () => {
    it("return the display name when it's defined", async () => {
      twitchServiceMock.getMe.mockResolvedValue({
        displayName: 'test',
      } as HelixPrivilegedUser)

      expect(await resolver.getTwitchUserName()).toEqual('test')
    })

    it('returns null if user is not defined', async () => {
      twitchServiceMock.getMe.mockResolvedValue(undefined)
      expect(await resolver.getTwitchUserName()).toBeUndefined()
    })
  })

  describe(TwitchResolver.prototype.getTwitchEditStreamInfoUrl.name, () => {
    it('returns an URL if the user is defined', async () => {
      twitchServiceMock.getMe.mockResolvedValue({
        name: 'TestUser',
      } as HelixPrivilegedUser)

      const result = await resolver.getTwitchEditStreamInfoUrl()
      expect(result).toBeDefined()
      expect(result).toContain('TestUser')
    })

    it('returns nothing if the user is not defined', async () => {
      twitchServiceMock.getMe.mockResolvedValue(undefined)

      expect(await resolver.getTwitchEditStreamInfoUrl()).toBeUndefined()
    })
  })

  describe(TwitchResolver.prototype.twitchGetClientId.name, () => {
    it('returns the clientId defined as environment variable', () => {
      expect(resolver.twitchGetClientId()).toEqual('test-client-id')
    })
  })

  describe(TwitchResolver.prototype.twitchGetChannelInfo.name, () => {
    it('returns current informations', async () => {
      const game: Partial<HelixGame> = { name: 'Development' }
      const partialHelixChannel: Partial<HelixChannel> = {
        title: 'My stream',
        getGame: () => Promise.resolve(game as HelixGame),
      }
      twitchServiceMock.getChannel.mockResolvedValue(
        partialHelixChannel as HelixChannel,
      )

      expect(await resolver.twitchGetChannelInfo()).toMatchObject({
        title: 'My stream',
        category: 'Development',
      })
    })
  })

  describe(TwitchResolver.prototype.twitchGetUsername.name, () => {
    it("return the display name when it's defined", async () => {
      twitchServiceMock.getMe.mockResolvedValue({
        displayName: 'test',
      } as HelixPrivilegedUser)

      expect(await resolver.twitchGetUsername()).toEqual('test')
    })

    it('returns null if user is not defined', async () => {
      twitchServiceMock.getMe.mockResolvedValue(undefined)
      expect(await resolver.twitchGetUsername()).toBeUndefined()
    })
  })
})
