import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { EnvironmentService } from '../env.service'
import { TwitchRedirectController } from './redirect.controller'

describe(TwitchRedirectController.name, () => {
  const envMock = createMock<EnvironmentService>({
    TWITCH_APP_REDIRECT_URI: 'deckard://oauth',
  })
  let controller: TwitchRedirectController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchRedirectController],
      providers: [{ provide: EnvironmentService, useValue: envMock }],
    }).compile()

    controller = module.get<TwitchRedirectController>(TwitchRedirectController)
  })

  it('returns the base redirect when query is empty', () => {
    const result = controller.handleRedirect({})

    expect(result).toEqual({ url: 'deckard://oauth' })
  })

  it('forwards query params to the app scheme', () => {
    const result = controller.handleRedirect({ code: 'abc', state: '123' })

    const url = new URL(result.url)
    expect(url.protocol).toBe('deckard:')
    expect(url.hostname).toBe('oauth')
    expect(url.searchParams.get('code')).toBe('abc')
    expect(url.searchParams.get('state')).toBe('123')
  })
})
