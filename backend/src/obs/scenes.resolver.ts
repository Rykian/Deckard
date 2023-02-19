import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { identity } from 'rxjs'
import { setTimeout } from 'timers/promises'
import { CheckScenesReport } from './scenes.object'
import { OBSScenesService, Topics } from './scenes.service'

@Resolver()
export class OBSScenesResolver {
  constructor(private service: OBSScenesService, private pubsub: PubSub) {}

  @Mutation(() => CheckScenesReport)
  obsScenesCheck() {
    return this.service.checkScenes()
  }

  @Mutation(() => Boolean)
  async obsScenesSwitch(
    @Args('scene') scene: string,
    @Args('instant', { nullable: true }) instant: boolean,
  ) {
    await this.service.switchScene(scene, instant)
    return true
  }

  @Query(() => [String])
  async obsScenesList() {
    return this.service.availableScenes
  }

  @Subscription(() => [String], { resolve: identity })
  obsScenesListUpdated() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(Topics.LIST_UPDATED, this.service.availableScenes),
    )
    return this.pubsub.asyncIterator(Topics.LIST_UPDATED)
  }

  @Subscription(() => String, { resolve: identity })
  obsScenesCurrentChanged() {
    setTimeout(1000).then(() =>
      this.pubsub.publish(Topics.CHANGED, this.service.programScene),
    )
    return this.pubsub.asyncIterator(Topics.CHANGED)
  }
}
