import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CheckScenesReport } from './scenes.object'
import { OBSScenesService } from './scenes.service'

@Resolver()
export class OBSScenesResolver {
  constructor(private scenes: OBSScenesService) {}

  @Mutation(() => CheckScenesReport)
  obsScenesCheck() {
    return this.scenes.checkScenes()
  }

  @Mutation(() => Boolean)
  async obsScenesSwitch(
    @Args('scene') scene: string,
    @Args('instant', { nullable: true }) instant: boolean,
  ) {
    await this.scenes.switchScene(scene, instant)
    return true
  }

  @Query(() => [String])
  async obsScenesList() {
    return this.scenes.availableScenes
  }
}
