import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class InviteInput {
  @Field(() => String)
  email: string;
}
