import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { CreateIntegrationArgs } from './dto/create-integration.args';
import { UpdateIntegrationArgs } from './dto/update-integration.args';
import { Integration } from './entities/integration.entity';
import { IntegrationService } from './integration.service';

@Resolver(() => Integration)
export class IntegrationResolver {
  constructor(private readonly integrationService: IntegrationService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Integration)
  createIntegration(
    @BearerAuth() auth: Required<Auth>,
    @Args() createIntegrationArgs: CreateIntegrationArgs,
  ): Observable<Integration> {
    return this.integrationService.create(
      auth.project.id,
      createIntegrationArgs,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Integration])
  integrations(@BearerAuth() auth: Required<Auth>): Observable<Integration[]> {
    return this.integrationService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Integration)
  integrationById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => String }) id: string,
  ): Observable<Integration> {
    return this.integrationService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Integration)
  updateIntegration(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateIntegrationArgs: UpdateIntegrationArgs,
  ): Observable<Integration> {
    return this.integrationService.update(
      auth.project.id,
      updateIntegrationArgs,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Integration)
  removeIntegration(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => String }) id: string,
  ): Observable<Integration> {
    return this.integrationService.remove(auth.project.id, id);
  }
}
