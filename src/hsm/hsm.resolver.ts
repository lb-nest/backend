import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';
import { HsmService } from './hsm.service';

@Resolver(() => Hsm)
export class HsmResolver {
  constructor(private readonly hsmService: HsmService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Hsm)
  createHsm(@User() user: any, @Args() input: CreateHsmInput): Promise<Hsm> {
    return this.hsmService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Hsm])
  hsm(@User() user: any): Promise<Hsm[]> {
    return this.hsmService.findAll(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Hsm)
  hsmById(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Hsm> {
    return this.hsmService.findOne(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Hsm)
  updateHsm(@User() user: any, @Args() input: UpdateHsmInput): Promise<Hsm> {
    return this.hsmService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Hsm)
  removeHsm(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Hsm> {
    return this.hsmService.remove(user, id);
  }
}
