import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { CreateWalletArgs } from './dto/create-wallet.args';
import { UpdateWalletArgs } from './dto/update-wallet.args';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Wallet)
  createWallet(
    @GqlHeaders('authorization') authorization: string,
    @Args() createWalletArgs: CreateWalletArgs,
  ) {
    return this.walletService.create(authorization, createWalletArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Wallet)
  wallet(@GqlHeaders('authorization') authorization: string) {
    return this.walletService.findOne(authorization);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Wallet)
  updateWallet(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateWalletArgs: UpdateWalletArgs,
  ) {
    return this.walletService.update(authorization, updateWalletArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Wallet)
  removeWallet(@GqlHeaders('authorization') authorization: string) {
    return this.walletService.remove(authorization);
  }
}
