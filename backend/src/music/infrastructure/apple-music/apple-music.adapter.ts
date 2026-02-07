import { Injectable, Logger } from '@nestjs/common'
import { runAppleScript } from 'run-applescript'
import { IMusicProvider } from '../../domain/music-provider.interface'
import { TrackEntity } from '../../domain/track.entity'
import { PlaybackStateEntity } from '../../domain/playback-state.entity'

interface AppleMusicTrackInfo {
  name: string
  artist: string
  album: string
  albumArtist: string
  duration: number // in seconds
  playedCount: number
  year: number
  playerPosition: number // in seconds
  playerState: 'playing' | 'paused' | 'stopped'
}

/**
 * Infrastructure Adapter: Apple Music Provider
 * Implements the IMusicProvider port using AppleScript to query the local Music app on macOS
 */
@Injectable()
export class AppleMusicAdapter implements IMusicProvider {
  private readonly logger = new Logger(AppleMusicAdapter.name)
  private interval?: NodeJS.Timer
  private currentTrack: TrackEntity | null = null
  private trackChangeCallbacks: Array<(track: TrackEntity | null) => void> = []
  private progressChangeCallbacks: Array<(progressMs: number | null) => void> =
    []

  async initialize(): Promise<void> {
    // Check if Music app is available on macOS
    try {
      await this.checkMusicAppAvailable()
      this.logger.log('Apple Music app detected. Starting polling.')
      this.startPolling()
    } catch (error) {
      this.logger.warn(
        'Apple Music app not available or not running. Polling disabled.',
      )
    }
  }

  getCurrentTrack(): TrackEntity | null {
    return this.currentTrack
  }

  async getCurrentPlaybackState(): Promise<PlaybackStateEntity | null> {
    const trackInfo = await this.fetchCurrentTrack()
    if (!trackInfo || trackInfo.playerState !== 'playing') {
      return PlaybackStateEntity.paused()
    }

    const track = this.mapAppleMusicTrackToEntity(trackInfo)
    return PlaybackStateEntity.create({
      track,
      progressMs: Math.floor(trackInfo.playerPosition * 1000),
      isPlaying: trackInfo.playerState === 'playing',
    })
  }

  startPolling(): void {
    if (this.interval) return

    this.logger.log('Polling track changes from Apple Music')

    this.interval = setInterval(async () => {
      try {
        const trackInfo = await this.fetchCurrentTrack()
        if (!trackInfo || trackInfo.playerState !== 'playing') {
          this.updateCurrentTrack(null)
          this.notifyProgressChange(null)
          return
        }

        const track = this.mapAppleMusicTrackToEntity(trackInfo)
        this.updateCurrentTrack(track)
        this.notifyProgressChange(Math.floor(trackInfo.playerPosition * 1000))
      } catch (error) {
        this.logger.error('Error polling Apple Music', error)
      }
    }, 3000)
  }

  stopPolling(): void {
    this.logger.log('Stop polling Apple Music')
    if (!this.interval) return

    clearInterval(this.interval)
    this.interval = undefined
  }

  onTrackChange(callback: (track: TrackEntity | null) => void): void {
    this.trackChangeCallbacks.push(callback)
  }

  onProgressChange(callback: (progressMs: number | null) => void): void {
    this.progressChangeCallbacks.push(callback)
  }

  // Private helper methods

  private async checkMusicAppAvailable(): Promise<void> {
    const script = `
      tell application "System Events"
        return name of processes contains "Music"
      end tell
    `
    const result = await runAppleScript(script)
    if (result !== 'true') {
      throw new Error('Music app is not running')
    }
  }

  private async fetchCurrentTrack(): Promise<AppleMusicTrackInfo | null> {
    const script = `
      tell application "Music"
        if player state is not stopped then
          set trackName to name of current track
          set trackArtist to artist of current track
          set trackAlbum to album of current track
          set trackAlbumArtist to album artist of current track
          set trackDuration to duration of current track
          set trackYear to year of current track
          set trackPlayedCount to played count of current track
          set playerPos to player position
          set playerSt to player state as string
          
          return trackName & "|" & trackArtist & "|" & trackAlbum & "|" & trackAlbumArtist & "|" & trackDuration & "|" & trackYear & "|" & trackPlayedCount & "|" & playerPos & "|" & playerSt
        else
          return ""
        end if
      end tell
    `

    try {
      const result = await runAppleScript(script)
      if (!result || result === '') {
        return null
      }

      const parts = result.split('|')
      if (parts.length < 9) {
        this.logger.warn('Invalid track info from AppleScript')
        return null
      }

      return {
        name: parts[0],
        artist: parts[1],
        album: parts[2],
        albumArtist: parts[3],
        duration: parseFloat(parts[4]),
        year: parseInt(parts[5], 10),
        playedCount: parseInt(parts[6], 10),
        playerPosition: parseFloat(parts[7]),
        playerState: this.parsePlayerState(parts[8]),
      }
    } catch (error) {
      this.logger.debug('Could not fetch track info', error)
      return null
    }
  }

  private parsePlayerState(state: string): 'playing' | 'paused' | 'stopped' {
    const normalized = state.toLowerCase().trim()
    if (normalized.includes('playing')) return 'playing'
    if (normalized.includes('paused')) return 'paused'
    return 'stopped'
  }

  private updateCurrentTrack(track: TrackEntity | null): void {
    if (track?.id === this.currentTrack?.id) return

    if (!track) {
      this.logger.debug('Paused or stopped')
    } else {
      this.logger.debug(
        `Track changed: ${track.name} (${track.album}) - ${track.artists.join(
          ', ',
        )}`,
      )
    }

    this.currentTrack = track
    this.notifyTrackChange(track)
  }

  private notifyTrackChange(track: TrackEntity | null): void {
    this.trackChangeCallbacks.forEach((callback) => callback(track))
  }

  private notifyProgressChange(progressMs: number | null): void {
    this.progressChangeCallbacks.forEach((callback) => callback(progressMs))
  }

  private mapAppleMusicTrackToEntity(
    trackInfo: AppleMusicTrackInfo,
  ): TrackEntity {
    // Generate a stable ID from track metadata
    const id = this.generateTrackId(trackInfo)

    return TrackEntity.create({
      id,
      name: trackInfo.name,
      artists: [trackInfo.artist],
      album: trackInfo.album,
      releaseDate: trackInfo.year.toString(),
      coverUrl: '', // AppleScript doesn't provide artwork URL
      externalUrl: '', // No external URL for local tracks
      durationMs: Math.floor(trackInfo.duration * 1000),
    })
  }

  private generateTrackId(trackInfo: AppleMusicTrackInfo): string {
    // Create a deterministic ID from track metadata
    const str = `${trackInfo.name}:${trackInfo.artist}:${trackInfo.album}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }
}
