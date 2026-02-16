import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { parseISO } from 'date-fns'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { StreamCountdownService, Topics } from './countdown.service'

@Resolver()
export class StreamCountdownResolver {
  constructor(
    private service: StreamCountdownService,
    private pubsub: PubSub,
  ) {}

  @Mutation(() => String, { description: 'Return the name of the countdown' })
  streamCountdownSet(
    @Args('target', { description: 'Targeted date in ISO format' })
    target: string,
    @Args('name', { description: 'Counter name' }) name: string,
  ) {
    console.log({ target, name, targetToDate: parseISO(target) })
    this.service.set(name, parseISO(target))
    return target
  }

  @Subscription(() => String, {
    description: 'Return the name of expired counters',
    resolve: identity,
    filter: (payload, variables) => {
      if (!variables?.name) return true

      return payload == variables.name
    },
  })
  streamCountdownExpired(
    @Args('name', { description: 'Countdown name', nullable: true })
    _name: string,
  ) {
    return this.pubsub.asyncIterableIterator(Topics.COUNTDOWN_EXPIRED)
  }

  @Subscription(() => String, {
    description: 'Notify when a countdown has been updated',
    resolve: (payload) => {
      return payload['target']
    },
    filter: (payload, args) => payload['name'] == args['name'],
  })
  streamCountdownUpdated(@Args('name') name: string) {
    // Service will publish updates when counters change
    return this.pubsub.asyncIterableIterator(Topics.COUNTDOWN_UPDATED)
  }

  @Query(() => String, { description: 'Expiration date as ISO string' })
  streamCountdownGet(@Args('name') name: string) {
    return this.service.get(name)?.toISOString()
  }
}
