import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { CreateMailingArgs } from './dto/create-mailing.args';
import { UpdateMailingArgs } from './dto/update-mailing.args';
import { Mailing } from './entities/mailing.entity';
import { MailingService } from './mailing.service';

@Resolver(() => Mailing)
export class MailingResolver {
  constructor(private readonly mailingService: MailingService) {}

  @Mutation(() => Mailing)
  createMailing(
    @GqlHeaders('authorization') authorization: string,
    @Args() createMailingArgs: CreateMailingArgs,
  ): Observable<Mailing> {
    return this.mailingService.create(authorization, createMailingArgs);
  }

  @Query(() => [Mailing])
  mailings(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Mailing[]> {
    return this.mailingService.findAll(authorization);
  }

  @Query(() => Mailing)
  mailingById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Mailing> {
    return this.mailingService.findOne(authorization, id);
  }

  @Mutation(() => Mailing)
  updateMailing(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateMailingArgs: UpdateMailingArgs,
  ): Observable<Mailing> {
    return this.mailingService.update(authorization, updateMailingArgs);
  }

  @Mutation(() => Mailing)
  removeMailing(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Mailing> {
    return this.mailingService.remove(authorization, id);
  }
}
