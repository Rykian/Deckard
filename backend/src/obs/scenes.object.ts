import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ItemReport {
  @Field()
  scene: string

  @Field(() => [String])
  items: string[] = []
}

@ObjectType()
export class CheckScenesReport {
  @Field(() => [String], { nullable: true })
  missingScenes?: string[]

  @Field(() => [ItemReport], { nullable: true })
  missingItems?: ItemReport[]
}

@ObjectType()
export class SceneChanging {
  @Field()
  from: string

  @Field()
  to: string
}
