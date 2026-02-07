import { Module, OnModuleInit } from '@nestjs/common'
import { PubSubModule } from '../pubsub.module'
import { MusicService } from './application/music.service'
import { AppleMusicAdapter } from './infrastructure/apple-music/apple-music.adapter'
import { MusicResolver } from './music.resolver'
import { MUSIC_PROVIDER_TOKEN } from './domain/music-provider.interface'

/**
 * Music Module
 * Configures the music domain with DDD architecture
 * Uses Apple Music (local macOS) as the default music provider adapter
 */
@Module({
  imports: [PubSubModule],
  providers: [
    // Infrastructure: Apple Music Adapter as the concrete implementation
    {
      provide: MUSIC_PROVIDER_TOKEN,
      useClass: AppleMusicAdapter,
    },
    // Application: Music Service
    MusicService,
    // Presentation: GraphQL Resolver
    MusicResolver,
  ],
  exports: [MusicService],
})
export class MusicModule implements OnModuleInit {
  constructor(private readonly musicService: MusicService) {}

  async onModuleInit() {
    await this.musicService.initialize()
  }
}
