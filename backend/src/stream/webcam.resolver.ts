import { Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { StreamWebcamService, Topics } from './webcam.service'

@Resolver()
export class StreamWebcamResolver {
  constructor(
    private service: StreamWebcamService,
    private pubsub: PubSub,
  ) {}

  @Mutation(() => Boolean)
  streamWebcamToggle() {
    return this.service.toggle()
  }

  @Subscription(() => Boolean, { resolve: identity })
  streamWebcamChanged() {
    // Publish current state when subscription starts
    this.pubsub.publish(Topics.VISIBILITY, this.service.visible)
    return this.pubsub.asyncIterableIterator(Topics.VISIBILITY)
  }

  @Mutation(() => Boolean)
  streamWebcamToggleBlur() {
    return this.service.toggleBlur()
  }

  @Subscription(() => Boolean, { resolve: identity })
  streamWebcamBlurChanged() {
    // Publish current state when subscription starts
    this.pubsub.publish(Topics.BLUR, this.service.blured)
    return this.pubsub.asyncIterableIterator(Topics.BLUR)
  }
}
