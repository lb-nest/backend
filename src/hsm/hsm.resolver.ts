import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { CreateHsmArgs } from './dto/create-hsm.args';
import { UpdateHsmArgs } from './dto/update-hsm.args';
import { Hsm } from './entities/hsm.entity';
import { HsmService } from './hsm.service';

@Resolver(() => Hsm)
export class HsmResolver {
  constructor(private readonly hsmService: HsmService) {}

  @Mutation(() => Hsm)
  createHsm(
    @GqlHeaders('authorization') authorization: string,
    @Args() createHsmArgs: CreateHsmArgs,
  ): Observable<Hsm> {
    return this.hsmService.create(authorization, createHsmArgs);
  }

  @Query(() => [Hsm])
  hsm(@GqlHeaders('authorization') authorization: string): Observable<Hsm[]> {
    return this.hsmService.findAll(authorization);
  }

  @Query(() => Hsm)
  hsmById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Hsm> {
    return this.hsmService.findOne(authorization, id);
  }

  @Mutation(() => Hsm)
  updateHsm(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateHsmArgs: UpdateHsmArgs,
  ): Observable<Hsm> {
    return this.hsmService.update(authorization, updateHsmArgs);
  }

  @Mutation(() => Hsm)
  removeHsm(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Hsm> {
    return this.hsmService.remove(authorization, id);
  }
}
