import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OBSConnectionService } from './connection.service';

@Resolver()
export class OBSConnectionResolver {
  constructor(private connection: OBSConnectionService) {}

  @Mutation(() => Boolean)
  async obsConnect(
    @Args('url') url: string,
    @Args('password', { nullable: true }) password?: string,
  ) {
    await this.connection.connect(url, password);
    return true;
  }
}
