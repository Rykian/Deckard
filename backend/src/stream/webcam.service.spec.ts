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
  const webcamBlurredSceneItem = {
    sourceName: 'webcam-blurred',
    sceneItemId: 2,
    sceneItemEnabled: false,
  }
  const sceneItems = [webcamSceneItem, webcamBlurredSceneItem]

  describe('assignIds', () => {
    it('assigns webcam item id', async () => {
      apiMock.call.mockImplementation(async (_type, _data) => ({ sceneItems }))

      await service.assignIds()
      expect(service.webcamId).toEqual(1)
    })

    it('throws an error if webcam is not present', async () => {
      apiMock.call.mockImplementation(async (_type, _data) => ({
        sceneItems: [],
      }))

      await expect(service.assignIds()).rejects.toBeInstanceOf(
        StreamWebcamError,
      )
      await expect(service.assignIds()).rejects.toMatchObject({
        item: 'webcam',
      })
    })

    it('throws an error if blurred webcam is not present', async () => {
      apiMock.call.mockImplementation(async (_type, _data) => ({
        sceneItems: [sceneItems[0]],
      }))

      await expect(service.assignIds()).rejects.toBeInstanceOf(
        StreamWebcamError,
      )
      await expect(service.assignIds()).rejects.toMatchObject({
        item: 'webcam-blurred',
      })
    })

    it('assigns blurredWebcam item id', async () => {
      apiMock.call.mockImplementation(async (_type, _data) => ({ sceneItems }))

      await service.assignIds()
      expect(service.blurredWebcamId).toEqual(2)
    })
  })

  describe('toggle', () => {
    it('sends a command to hide the webcam when webcam is visible', async () => {
      apiMock.call.mockImplementation(async () => ({ sceneItems }))

      await service.assignIds()
      expect(service.visible).toBeTruthy()
      await service.toggle()
      expect(apiMock.call).toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: false,
        sceneItemId: 1,
        sceneName: '_maincam',
      })
      expect(apiMock.call).toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: false,
        sceneItemId: 2,
        sceneName: '_maincam',
      })
    })

    it('sends a command to show the webcam when webcam is not visible', async () => {
      apiMock.call.mockImplementation(async () => ({
        sceneItems: [
          { ...webcamSceneItem, sceneItemEnabled: false },
          webcamBlurredSceneItem,
        ],
      }))

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
    it('sends a command to show the blurred webcam', async () => {
      apiMock.call.mockImplementation(async () => ({ sceneItems }))
      await service.assignIds()
      expect(service.blured).toBeFalsy()
      await service.toggleBlur()
      expect(apiMock.call).toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: true,
        sceneItemId: 2,
        sceneName: '_maincam',
      })
    })

    it('sends a command to hide the blurred webcam', async () => {
      apiMock.call.mockImplementation(async () => ({
        sceneItems: [
          webcamSceneItem,
          { ...webcamBlurredSceneItem, sceneItemEnabled: true },
        ],
      }))
      await service.assignIds()
      expect(service.blured).toBeTruthy()
      await service.toggleBlur()
      expect(apiMock.call).toBeCalledWith('SetSceneItemEnabled', {
        sceneItemEnabled: false,
        sceneItemId: 2,
        sceneName: '_maincam',
      })
    })
  })
})
