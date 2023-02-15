import { Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { setTimeout } from 'timers/promises'
import { OBSStreamService } from './stream.service'

@Resolver()
export class OBSStreamResolver {
  constructor(private service: OBSStreamService, private pubsub: PubSub) {}

  @Query(() => Boolean)
  obsStreamIsStreaming() {
    return this.service.isStreaming
  }

  @Subscription(() => Boolean, { resolve: identity })
  obsStreamStreamingUpdated() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(
        this.service.IS_STREAMING,
        this.obsStreamIsStreaming(),
      ),
    )
    return this.pubsub.asyncIterator(this.service.IS_STREAMING)
  }
}
