import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Channel } from 'src/channel/entities/channel.entity';

@ObjectType()
class Approval {
  @Field(() => Channel)
  channel: Channel;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class Hsm {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  code: string;

  @Field(() => String)
  text: string;

  @Field(() => GraphQLJSON, { nullable: true })
  buttons: any[];

  @Field(() => [Approval])
  approval: Approval[];
}
