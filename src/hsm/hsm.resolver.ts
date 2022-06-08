import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';
import { HsmService } from './hsm.service';

@Resolver(() => Hsm)
export class HsmResolver {
  constructor(private readonly hsmService: HsmService) {}

  @Mutation(() => Hsm)
  createHsm(
    @Auth() authorization: string,
    @Args() input: CreateHsmInput,
  ): Promise<Hsm> {
    return this.hsmService.create(authorization, input);
  }

  @Query(() => [Hsm])
  hsm(@Auth() authorization: string): Promise<Hsm[]> {
    return this.hsmService.findAll(authorization);
  }

  @Query(() => Hsm)
  hsmById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Hsm> {
    return this.hsmService.findOne(authorization, id);
  }

  @Mutation(() => Hsm)
  updateHsm(
    @Auth() authorization: string,
    @Args() input: UpdateHsmInput,
  ): Promise<Hsm> {
    return this.hsmService.update(authorization, input);
  }

  @Mutation(() => Hsm)
  removeHsm(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Hsm> {
    return this.hsmService.remove(authorization, id);
  }
}
