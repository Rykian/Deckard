import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  IMusicProvider,
  MUSIC_PROVIDER_TOKEN,
} from '../domain/music-provider.interface'
import { TrackEntity } from '../domain/track.entity'
import { PlaybackStateEntity } from '../domain/playback-state.entity'

/**
 * Application Service: Music Service
 * Orchestrates music-related use cases using the music provider port
 */
@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name)

  constructor(
    @Inject(MUSIC_PROVIDER_TOKEN)
    private readonly musicProvider: IMusicProvider,
  ) {}

  async initialize(): Promise<void> {
    this.logger.log('Initializing music service')
    await this.musicProvider.initialize()
  }

  getCurrentTrack(): TrackEntity | null {
    return this.musicProvider.getCurrentTrack()
  }

  async getCurrentPlaybackState(): Promise<PlaybackStateEntity | null> {
    return await this.musicProvider.getCurrentPlaybackState()
  }

  startPolling(): void {
    this.musicProvider.startPolling()
  }

  stopPolling(): void {
    this.musicProvider.stopPolling()
  }

  onTrackChange(callback: (track: TrackEntity | null) => void): void {
    this.musicProvider.onTrackChange(callback)
  }

  onProgressChange(callback: (progressMs: number | null) => void): void {
    this.musicProvider.onProgressChange(callback)
  }
}
