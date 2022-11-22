import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateWalletArgs {
  @Field(() => String)
  country: string;

  @Field(() => String, { nullable: true })
  currency?: string;
}
