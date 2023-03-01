import { createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { PubSub } from 'graphql-subscriptions'
import { EnvironmentService } from '../env.service'
import { OBSAPI } from '../obs/_.service'
import { StreamWebcamError, StreamWebcamService } from './webcam.service'

describe(StreamWebcamService.name, () => {
  let service: StreamWebcamService

  const envMock = createMock<EnvironmentService>()
  const pubsubMock = createMock<PubSub>()
  const apiMock = createMock<OBSAPI>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamWebcamService,
        { provide: OBSAPI, useValue: apiMock },
        { provide: PubSub, useValue: pubsubMock },
        { provide: EnvironmentService, useValue: envMock },
      ],
    }).compile()

    service = module.get<StreamWebcamService>(StreamWebcamService)
  })

  it('is defined', () => {
    expect(service).not.toBeUndefined()
  })
  const webcamSceneItem = {
    sourceName: 'webcam',
    sceneItemId: 1,
    sceneItemEnabled: true,
  }
  const sceneItems = [webcamSceneItem]
  const filters = [
    'blur_1',
    'blur_2',
    'blur_3',
    'blur_4',
    'blur_5',
    'blur_6',
  ].map((filterName) => ({
    filterName,
    sourceName: 'webcam',
    filterEnabled: true,
  }))

  describe('assignIds', () => {
    it('assigns webcam item id', async () => {
      apiMock.call.mockImplementation(async (type) => {
        switch (type) {
          case 'GetSceneItemList':
            return { sceneItems }
          case 'GetSourceFilterList':
            return { filters }
        }
      })

      await service.assignIds()
      expect(service.itemId).toEqual(1)
    })

    it('throws an error if webcam is not present', async () => {
      apiMock.call.mockImplementation(async () => ({ sceneItems: [] }))

      await expect(service.assignIds()).rejects.toBeInstanceOf(
        StreamWebcamError,
      )
      await expect(service.assignIds()).rejects.toMatchObject({
        item: 'webcam',
      })
    })
  })

  describe('toggle', () => {
    it('sends a command to hide the webcam when webcam is visible', async () => {
      apiMock.call.mockImplementation(async (type) => {
        switch (type) {
          case 'GetSceneItemList':
            return { sceneItems }
          case 'GetSourceFilterList':
            return { filters }
        }
      })

      await service.assignIds()
      expect(service.visible).toBeTruthy()
      await service.toggle()
      expect(apiMock.call).toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: false,
        sceneItemId: 1,
        sceneName: '_maincam',
      })
    })

    it('sends a command to show the webcam when webcam is not visible', async () => {
      apiMock.call.mockImplementation(async (type) => {
        switch (type) {
          case 'GetSceneItemList':
            return {
              sceneItems: [{ ...webcamSceneItem, sceneItemEnabled: false }],
            }
          case 'GetSourceFilterList':
            return { filters }
        }
      })

      await service.assignIds()
      expect(service.visible).toBeFalsy()
      await service.toggle()
      expect(apiMock.call).toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: true,
        sceneItemId: 1,
        sceneName: '_maincam',
      })
      expect(apiMock.call).not.toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: true,
        sceneItemId: 2,
        sceneName: '_maincam',
      })
    })
  })

  describe('toggleBlur', () => {
    it('sends a command to blur the webcam', async () => {
      apiMock.call.mockImplementation(async (type) => {
        switch (type) {
          case 'GetSceneItemList':
            return { sceneItems }
          case 'GetSourceFilterList':
            return {
              filters: filters.map((filter) => ({
                ...filter,
                filterEnabled: false,
              })),
            }
        }
      })
      await service.assignIds()
      expect(service.blured).toBeFalsy()
      await service.toggleBlur()
      expect(apiMock.call).toBeCalledWith('SetSourceFilterEnabled', {
        sourceName: 'webcam',
        filterName: 'blur_6',
        filterEnabled: true,
      })
    })

    it('sends a command to unblur the webcam', async () => {
      apiMock.call.mockImplementation(async (type) => {
        switch (type) {
          case 'GetSceneItemList':
            return { sceneItems }
          case 'GetSourceFilterList':
            return { filters }
        }
      })
      await service.assignIds()
      expect(service.blured).toBeTruthy()
      await service.toggleBlur()
      expect(apiMock.call).toBeCalledWith('SetSourceFilterEnabled', {
        sourceName: 'webcam',
        filterName: 'blur_1',
        filterEnabled: false,
      })
    })
  })
})
