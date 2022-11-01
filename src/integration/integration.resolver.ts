import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { CreateIntegrationArgs } from './dto/create-integration.args';
import { Integration } from './entities/integration.entity';
import { IntegrationService } from './integration.service';

@Resolver(() => Integration)
export class IntegrationResolver {
  constructor(private readonly integrationService: IntegrationService) {}

  @Mutation(() => Integration)
  createIntegration(
    @GqlHeaders('authorization') authorization: string,
    @Args() createIntegrationArgs: CreateIntegrationArgs,
  ): Observable<Integration> {
    return this.integrationService.create(authorization, createIntegrationArgs);
  }

  @Query(() => [Integration])
  integrations(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Integration[]> {
    return this.integrationService.findAll(authorization);
  }

  @Query(() => Integration)
  integrationById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => String }) id: string,
  ): Observable<Integration> {
    return this.integrationService.findOne(authorization, id);
  }

  @Mutation(() => Integration)
  removeIntegration(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => String }) id: string,
  ): Observable<Integration> {
    return this.integrationService.remove(authorization, id);
  }
}
