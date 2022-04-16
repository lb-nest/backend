import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';
import { HsmService } from './hsm.service';

@Resolver(() => Hsm)
export class HsmResolver {
  constructor(private readonly hsmService: HsmService) {}

  @Mutation(() => Hsm)
  createHsm(@Context() context: any, @Args() input: CreateHsmInput) {
    return this.hsmService.create(context.req.headers.authorization, input);
  }

  @Query(() => [Hsm])
  hsm(@Context() context: any) {
    return this.hsmService.findAll(context.req.headers.authorization);
  }

  @Query(() => Hsm)
  hsmById(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.hsmService.findOne(context.req.headers.authorization, id);
  }

  @Mutation(() => Hsm)
  updateHsm(@Context() context: any, @Args() input: UpdateHsmInput) {
    return this.hsmService.update(context.req.headers.authorization, input);
  }

  @Mutation(() => Hsm)
  removeHsm(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.hsmService.remove(context.req.headers.authorization, id);
  }
}
