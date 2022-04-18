import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UpdateContactInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => [Int], { nullable: true })
  tags?: number[];
}
