import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CheckScenesReport } from './report.object';
import { OBSService } from './service';

@Resolver()
export class OBSResolver {
  constructor(private obs: OBSService) {}

  @Query(() => Boolean)
  obsConnected(): boolean {
    return this.obs.identified;
  }

  @Mutation(() => Boolean)
  async obsConnect(
    @Args('url') url: string,
    @Args('password', { nullable: true }) password?: string,
  ) {
    await this.obs.connect(url, password);
    return true;
  }

  @Mutation(() => CheckScenesReport)
  async obsCheckScenes(): Promise<CheckScenesReport> {
    return this.obs.checkScenes();
  }
}
