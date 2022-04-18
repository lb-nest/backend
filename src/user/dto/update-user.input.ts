import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;
}
