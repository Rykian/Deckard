import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { parseISO } from 'date-fns'
import { StreamSequencesStartService } from './start.service'

@Resolver()
export class StreamSequencesStartResolver {
  constructor(private service: StreamSequencesStartService) {}

  @Mutation(() => Boolean)
  async streamSequenceStart(
    @Args('targetedTime', { nullable: true }) targetedTime?: string,
  ) {
    const time = targetedTime ? parseISO(targetedTime) : undefined
    await this.service.startStreaming(time)
    return true
  }

  @Mutation(() => Boolean)
  streamSequenceStartToggleOnCountdownExpiring(@Args('scene') scene: string) {
    return this.service.toggleStartOnExpiring(scene)
  }

  @Mutation(() => Boolean)
  async streamSequenceStartImmediatly(@Args('scene') scene: string) {
    await this.service.startImmediatly(scene)
    return true
  }
}
