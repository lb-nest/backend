import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { CreateHsmArgs } from './dto/create-hsm.args';
import { UpdateHsmArgs } from './dto/update-hsm.args';
import { Hsm } from './entities/hsm.entity';
import { HsmService } from './hsm.service';

@Resolver(() => Hsm)
export class HsmResolver {
  constructor(private readonly hsmService: HsmService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Hsm)
  createHsm(
    @BearerAuth() auth: Required<Auth>,
    @Args() createHsmArgs: CreateHsmArgs,
  ): Observable<Hsm> {
    return this.hsmService.create(auth.project.id, createHsmArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Hsm])
  hsm(@BearerAuth() auth: Required<Auth>): Observable<Hsm[]> {
    return this.hsmService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Hsm)
  hsmById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Hsm> {
    return this.hsmService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Hsm)
  updateHsm(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateHsmArgs: UpdateHsmArgs,
  ): Observable<Hsm> {
    return this.hsmService.update(auth.project.id, updateHsmArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Hsm)
  removeHsm(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Hsm> {
    return this.hsmService.remove(auth.project.id, id);
  }
}
