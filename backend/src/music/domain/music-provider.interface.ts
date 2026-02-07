import { PlaybackStateEntity } from './playback-state.entity'
import { TrackEntity } from './track.entity'

export const MUSIC_PROVIDER_TOKEN = 'MUSIC_PROVIDER_TOKEN'

/**
 * Port: Music Provider Interface
 * Defines the contract that any music provider adapter must implement
 * Following the Hexagonal Architecture pattern (Port & Adapter)
 */
export interface IMusicProvider {
  /**
   * Initialize the music provider (setup auth, start polling, etc.)
   */
  initialize(): Promise<void>

  /**
   * Get the current track being played
   */
  getCurrentTrack(): TrackEntity | null

  /**
   * Get the current playback state
   */
  getCurrentPlaybackState(): Promise<PlaybackStateEntity | null>

  /**
   * Start polling for track changes
   */
  startPolling(): void

  /**
   * Stop polling for track changes
   */
  stopPolling(): void

  /**
   * Subscribe to track changes
   */
  onTrackChange(callback: (track: TrackEntity | null) => void): void

  /**
   * Subscribe to progress updates
   */
  onProgressChange(callback: (progressMs: number | null) => void): void
}
