import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { StreamSequencesPauseService } from './pause.service'

@Resolver()
export class StreamSequencesPauseResolver {
  constructor(private service: StreamSequencesPauseService) {}

  @Mutation(() => String, {
    description:
      'Set pause scene on stream and returns the previous scene name (before pause)',
  })
  streamSequencePause() {
    return this.service.pause()
  }

  @Mutation(() => Boolean, { description: 'Unpause the stream' })
  async streamSequencePauseUnpause(
    @Args('scene', {
      nullable: true,
      description:
        'Name of the scene to switch to. If not define it will be the scene before the stream was paused',
    })
    scene?: string,
  ) {
    await this.service.unpause(scene)
    return true
  }
}
