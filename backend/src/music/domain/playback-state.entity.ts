import { TrackEntity } from './track.entity'

/**
 * Domain Entity: Playback State
 * Represents the current playback state of a music provider
 */
export class PlaybackStateEntity {
  constructor(
    public readonly track: TrackEntity | null,
    public readonly progressMs: number | null,
    public readonly isPlaying: boolean,
  ) {}

  static create(params: {
    track: TrackEntity | null
    progressMs: number | null
    isPlaying: boolean
  }): PlaybackStateEntity {
    return new PlaybackStateEntity(
      params.track,
      params.progressMs,
      params.isPlaying,
    )
  }

  static paused(): PlaybackStateEntity {
    return new PlaybackStateEntity(null, null, false)
  }
}
