import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateWalletArgs } from './create-wallet.args';

@ArgsType()
export class UpdateWalletArgs extends PartialType(CreateWalletArgs) {
  @Field(() => Int)
  id: number;
}
