import { Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { setTimeout } from 'timers/promises'
import { StreamWebcamService, Topics } from './webcam.service'

@Resolver()
export class StreamWebcamResolver {
  constructor(private service: StreamWebcamService, private pubsub: PubSub) {}

  @Mutation(() => Boolean)
  streamWebcamToggle() {
    return this.service.toggle()
  }

  @Subscription(() => Boolean, { resolve: identity })
  streamWebcamChanged() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(Topics.VISIBILITY, this.service.enabled),
    )
    return this.pubsub.asyncIterator(Topics.VISIBILITY)
  }
}
