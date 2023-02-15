import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { StreamSequencesStopService } from './stop.service'

@Resolver()
export class StreamSequencesStopResolver {
  constructor(private service: StreamSequencesStopService) {}

  @Mutation(() => Boolean)
  async streamSequenceStop() {
    await this.service.stop()
    return true
  }

  @Mutation(() => Boolean)
  streamSequenceStopCancel(@Args('scene', { nullable: true }) scene?: string) {
    this.service.cancel(scene)
    return true
  }
}
