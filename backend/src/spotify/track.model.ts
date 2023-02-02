import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Track {
  @Field(() => ID)
  id: string;

  @Field(() => [String])
  artists: string[];

  @Field()
  album: string;

  @Field()
  name: string;

  @Field()
  release: string;

  @Field()
  cover: string;

  @Field()
  url: string;
}
