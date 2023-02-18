import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PortScannerResult {
  @Field()
  ip: string

  @Field()
  port: string

  @Field({ nullable: true })
  hostname?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  secure?: boolean
}
