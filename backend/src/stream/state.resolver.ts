import { Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { setTimeout } from 'timers/promises'
import { State, StreamStateService, Topics } from './state.service'

@Resolver()
export class StreamStateResolver {
  constructor(private service: StreamStateService, private pubsub: PubSub) {}

  @Subscription(() => State, { resolve: identity, nullable: true })
  streamStateChanged() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(Topics.CHANGED, this.service.state),
    )
    return this.service.sequenceIterator()
  }
}
