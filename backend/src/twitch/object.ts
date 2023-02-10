import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TwitchCategory {
  @Field()
  id: string

  @Field()
  name: string
}

@ObjectType()
export class TwitchChannelInfo {
  @Field()
  category: TwitchCategory

  @Field()
  title: string
}
