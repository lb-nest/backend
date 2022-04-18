import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';
import { HsmService } from './hsm.service';

@Resolver(() => Hsm)
export class HsmResolver {
  constructor(private readonly hsmService: HsmService) {}

  @Mutation(() => Hsm)
  createHsm(
    @Headers('authorization') authorization: string,
    @Args() input: CreateHsmInput,
  ) {
    return this.hsmService.create(authorization, input);
  }

  @Query(() => [Hsm])
  hsm(@Headers('authorization') authorization: string) {
    return this.hsmService.findAll(authorization);
  }

  @Query(() => Hsm)
  hsmById(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.hsmService.findOne(authorization, id);
  }

  @Mutation(() => Hsm)
  updateHsm(
    @Headers('authorization') authorization: string,
    @Args() input: UpdateHsmInput,
  ) {
    return this.hsmService.update(authorization, input);
  }

  @Mutation(() => Hsm)
  removeHsm(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.hsmService.remove(authorization, id);
  }
}
