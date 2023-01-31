import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { identity } from 'rxjs';
import { setTimeout } from 'timers/promises';
import { Instance } from './connection.object';
import { OBSConnectionService, Topics } from './connection.service';

@Resolver()
export class OBSConnectionResolver {
  constructor(
    private connection: OBSConnectionService,
    private pubsub: PubSub,
  ) {}

  @Mutation(() => Boolean)
  async obsConnect(
    @Args('host') host: string,
    @Args('port') port: string,
    @Args('password', { nullable: true }) password?: string,
  ) {
    await this.connection.connect(host, port, password);
    return true;
  }

  @Query(() => String, { nullable: true })
  obsCurrentInstance() {
    return this.connection.url;
  }

  @Subscription(() => String, {
    nullable: true,
    resolve: identity,
  })
  obsCurrentInstanceUpdated() {
    setTimeout(1000).then(() => {
      this.pubsub.publish(Topics.INSTANCE_UPDATED, this.obsCurrentInstance());
    });
    return this.pubsub.asyncIterator(Topics.INSTANCE_UPDATED);
  }

  @Query(() => [Instance])
  async obsInstanceList() {
    return this.connection.listNetworkOBSInstances();
  }
}
