import { createMock } from '@golevelup/ts-jest'
import { Test } from '@nestjs/testing'
import { PubSub } from 'graphql-subscriptions'
import { EnvironmentService } from '../env.service'
import { RedisService } from '../redis.service'
import { Track } from './track.model'
import { SpotifyTrackService, Topics } from './track.service'

describe(SpotifyTrackService.name, () => {
  let service: SpotifyTrackService

  const redisMock = createMock<RedisService>()
  const pubsubMock = createMock<PubSub>()
  const envMock = createMock<EnvironmentService>()

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SpotifyTrackService,
        { provide: RedisService, useValue: redisMock },
        { provide: PubSub, useValue: pubsubMock },
        { provide: EnvironmentService, useValue: envMock },
      ],
    }).compile()

    service = module.get(SpotifyTrackService)
  })
  afterEach(() => service.stopTrackPolling())

  describe('set currentTrack', () => {
    it("shouldn't do anything if the track is the same as previously", () => {
      expect(service.currentTrack).toBeNull()
      service.currentTrack = null
      expect(pubsubMock.publish).not.toBeCalled()
    })

    it('should publish the track if the track changes', () => {
      const track = new Track()
      track.id = '1'
      service.currentTrack = track

      expect(pubsubMock.publish).toBeCalledWith(Topics.CURRENT_TRACK, {
        id: '1',
      })
    })

    it('should publish a current null track if the track is becoming null', () => {
      const track = new Track()
      track.id = '1'
      service.currentTrack = track
      service.currentTrack = null

      expect(pubsubMock.publish).toBeCalledWith(Topics.CURRENT_TRACK, null)
    })
  })
})
