import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CreateWalletArgs {
  @Field(() => Int)
  exampleField: number;
}
