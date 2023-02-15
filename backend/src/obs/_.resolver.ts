import { Query, Resolver } from '@nestjs/graphql'

import { OBSAPI } from './_.service'

@Resolver()
export class OBSResolver {
  constructor(private obs: OBSAPI) {}

  @Query(() => Boolean)
  obsConnected(): boolean {
    return this.obs.identified
  }
}
