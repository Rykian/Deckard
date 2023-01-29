import { Mutation, Resolver } from '@nestjs/graphql';
import { CheckScenesReport } from './scenes.object';
import { OBSScenesService } from './scenes.service';

@Resolver()
export class OBSScenesResolver {
  constructor(private scenes: OBSScenesService) {}

  @Mutation(() => CheckScenesReport)
  async obsScenesCheck(): Promise<CheckScenesReport> {
    return this.scenes.checkScenes();
  }
}
