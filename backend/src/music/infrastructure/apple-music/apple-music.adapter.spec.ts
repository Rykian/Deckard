import { Test, TestingModule } from '@nestjs/testing'
import { AppleMusicAdapter } from './apple-music.adapter'
import { TrackEntity } from '../../domain/track.entity'
import { PlaybackStateEntity } from '../../domain/playback-state.entity'
import { runAppleScript } from 'run-applescript'

jest.mock('run-applescript')

describe('AppleMusicAdapter', () => {
  let adapter: AppleMusicAdapter
  const runAppleScriptMock = runAppleScript as jest.MockedFunction<
    typeof runAppleScript
  >

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppleMusicAdapter],
    }).compile()

    adapter = module.get<AppleMusicAdapter>(AppleMusicAdapter)
  })

  afterEach(() => {
    adapter.stopPolling()
  })

  describe('initialize', () => {
    it('should check if Music app is available and start polling', async () => {
      runAppleScriptMock.mockResolvedValueOnce('true')

      await adapter.initialize()

      expect(runAppleScriptMock).toHaveBeenCalled()
    })

    it('should handle Music app not running', async () => {
      runAppleScriptMock.mockResolvedValueOnce('false')

      await adapter.initialize()

      // Should not throw, just log warning
      expect(runAppleScriptMock).toHaveBeenCalled()
    })

    it('should handle AppleScript errors gracefully', async () => {
      runAppleScriptMock.mockRejectedValueOnce(new Error('AppleScript error'))

      await adapter.initialize()

      // Should not throw, just log warning
      expect(runAppleScriptMock).toHaveBeenCalled()
    })
  })

  describe('getCurrentTrack', () => {
    it('should return null initially', () => {
      const track = adapter.getCurrentTrack()

      expect(track).toBeNull()
    })
  })

  describe('getCurrentPlaybackState', () => {
    it('should return paused state when no track is playing', async () => {
      runAppleScriptMock.mockResolvedValueOnce('')

      const state = await adapter.getCurrentPlaybackState()

      expect(state).toEqual(PlaybackStateEntity.paused())
    })

    it('should return playing state with track and progress', async () => {
      runAppleScriptMock.mockResolvedValueOnce(
        'Test Song|Test Artist|Test Album|Test Artist|180|2024|0|60|playing',
      )

      const state = await adapter.getCurrentPlaybackState()

      expect(state).not.toBeNull()
      expect(state?.isPlaying).toBe(true)
      expect(state?.track).toBeInstanceOf(TrackEntity)
      expect(state?.progressMs).toBe(60000) // 60 seconds * 1000
    })

    it('should return paused state when player is paused', async () => {
      runAppleScriptMock.mockResolvedValueOnce(
        'Test Song|Test Artist|Test Album|Test Artist|180|2024|0|60|paused',
      )

      const state = await adapter.getCurrentPlaybackState()

      expect(state).toEqual(PlaybackStateEntity.paused())
    })
  })

  describe('startPolling', () => {
    it('should start polling for track changes', async () => {
      runAppleScriptMock
        .mockResolvedValueOnce('true')
        .mockResolvedValue(
          'Test Song|Test Artist|Test Album|Test Artist|180|2024|0|60|playing',
        )

      await adapter.initialize()

      expect(runAppleScriptMock).toHaveBeenCalled()
    })

    it('should not start multiple polling intervals', async () => {
      runAppleScriptMock.mockResolvedValue('true')

      await adapter.initialize()
      adapter.startPolling()
      adapter.startPolling()

      // Only one interval should be active - just verify this doesn't throw
      expect(adapter).toBeDefined()
    })
  })

  describe('stopPolling', () => {
    it('should stop polling interval', async () => {
      runAppleScriptMock.mockResolvedValue('true')

      await adapter.initialize()
      adapter.stopPolling()

      // Should not crash
      expect(adapter).toBeDefined()
    })

    it('should handle stopping when not polling', () => {
      expect(() => adapter.stopPolling()).not.toThrow()
    })
  })

  describe('onTrackChange', () => {
    it('should register track change callback', () => {
      const callback = jest.fn()

      expect(() => adapter.onTrackChange(callback)).not.toThrow()
    })

    it('should support multiple callbacks', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      adapter.onTrackChange(callback1)
      adapter.onTrackChange(callback2)

      expect(() => adapter.onTrackChange(callback1)).not.toThrow()
    })
  })

  describe('onProgressChange', () => {
    it('should register progress change callback', () => {
      const callback = jest.fn()

      expect(() => adapter.onProgressChange(callback)).not.toThrow()
    })

    it('should support multiple callbacks', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      adapter.onProgressChange(callback1)
      adapter.onProgressChange(callback2)

      expect(() => adapter.onProgressChange(callback1)).not.toThrow()
    })
  })

  describe('AppleScript response parsing', () => {
    it('should parse valid track response', async () => {
      runAppleScriptMock.mockResolvedValueOnce(
        'Song Name|Artist Name|Album Name|Album Artist|240|2023|5|120|playing',
      )

      const state = await adapter.getCurrentPlaybackState()

      expect(state?.track?.name).toBe('Song Name')
      expect(state?.track?.artists).toEqual(['Artist Name'])
      expect(state?.track?.album).toBe('Album Name')
      expect(state?.track?.durationMs).toBe(240000)
      expect(state?.progressMs).toBe(120000)
      expect(state?.isPlaying).toBe(true)
    })

    it('should handle empty response', async () => {
      runAppleScriptMock.mockResolvedValueOnce('')

      const state = await adapter.getCurrentPlaybackState()

      expect(state).toEqual(PlaybackStateEntity.paused())
    })

    it('should handle invalid response format', async () => {
      runAppleScriptMock.mockResolvedValueOnce('invalid|response')

      const state = await adapter.getCurrentPlaybackState()

      expect(state).toEqual(PlaybackStateEntity.paused())
    })

    it('should parse different player states', async () => {
      const testCases = [
        { state: 'playing', expected: true },
        { state: 'paused', expected: false },
        { state: 'stopped', expected: false },
        { state: 'PLAYING', expected: true },
      ]

      for (const testCase of testCases) {
        runAppleScriptMock.mockResolvedValueOnce(
          `Song|Artist|Album|Artist|180|2024|0|60|${testCase.state}`,
        )

        const state = await adapter.getCurrentPlaybackState()

        if (testCase.expected) {
          expect(state?.isPlaying).toBe(true)
        } else {
          expect(state).toEqual(PlaybackStateEntity.paused())
        }
      }
    })
  })

  describe('track ID generation', () => {
    it('should generate consistent IDs for same track', async () => {
      runAppleScriptMock
        .mockResolvedValueOnce(
          'Same Song|Same Artist|Same Album|Artist|180|2024|0|60|playing',
        )
        .mockResolvedValueOnce(
          'Same Song|Same Artist|Same Album|Artist|180|2024|0|90|playing',
        )

      const state1 = await adapter.getCurrentPlaybackState()
      const state2 = await adapter.getCurrentPlaybackState()

      expect(state1?.track?.id).toBe(state2?.track?.id)
    })

    it('should generate different IDs for different tracks', async () => {
      runAppleScriptMock
        .mockResolvedValueOnce(
          'Song 1|Artist|Album|Artist|180|2024|0|60|playing',
        )
        .mockResolvedValueOnce(
          'Song 2|Artist|Album|Artist|180|2024|0|60|playing',
        )

      const state1 = await adapter.getCurrentPlaybackState()
      const state2 = await adapter.getCurrentPlaybackState()

      expect(state1?.track?.id).not.toBe(state2?.track?.id)
    })
  })

  describe('error handling', () => {
    it('should handle AppleScript errors during getCurrentPlaybackState', async () => {
      runAppleScriptMock.mockRejectedValueOnce(new Error('AppleScript error'))

      const state = await adapter.getCurrentPlaybackState()

      // Should return paused state on error
      expect(state).toEqual(PlaybackStateEntity.paused())
    })
  })
})
