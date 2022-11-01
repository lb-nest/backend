import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { InitializeFeatureArgs } from './dto/initialize-feature.args';
import { Feature } from './entities/feature.entity';
import { FeatureService } from './feature.service';

@Resolver(() => Feature)
export class FeatureResolver {
  constructor(private readonly featureService: FeatureService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Feature)
  initializeFeature(
    @GqlHeaders('authorization') authorization: string,
    @Auth() auth: Required<TokenPayload>,
    @Args() initializeFeatureArgs: InitializeFeatureArgs,
  ): Promise<Feature> {
    return this.featureService.initializeForProject(
      authorization,
      Object.assign(initializeFeatureArgs, {
        id: auth.project.id,
      }),
    );
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Feature)
  features(@Auth() auth: Required<TokenPayload>): Promise<Feature> {
    return this.featureService.findForProject(auth.project.id);
  }
}
