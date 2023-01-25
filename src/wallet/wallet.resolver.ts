import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
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
    @BearerAuth() auth: Required<Auth>,
    @Args() createWalletArgs: CreateWalletArgs,
  ) {
    return this.walletService.create(auth.project.id, createWalletArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Wallet)
  wallet(@BearerAuth() auth: Required<Auth>) {
    return this.walletService.findOne(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Wallet)
  updateWallet(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateWalletArgs: UpdateWalletArgs,
  ) {
    return this.walletService.update(auth.project.id, updateWalletArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Wallet)
  removeWallet(@BearerAuth() auth: Required<Auth>) {
    return this.walletService.remove(auth.project.id);
  }
}
