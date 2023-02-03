import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { CreateMailingArgs } from './dto/create-mailing.args';
import { FindAllMailingWorkersDto } from './dto/find-all-mailing-workers.args';
import { UpdateMailingArgs } from './dto/update-mailing.args';
import { MailingWorker } from './entities/mailing-worker.entity';
import { Mailing } from './entities/mailing.entity';
import { MailingService } from './mailing.service';

@Resolver(() => Mailing)
export class MailingResolver {
  constructor(private readonly mailingService: MailingService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Mailing)
  createMailing(
    @BearerAuth() auth: Required<Auth>,
    @Args() createMailingArgs: CreateMailingArgs,
  ): Observable<Mailing> {
    return this.mailingService.create(auth.project.id, createMailingArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Mailing])
  mailings(@BearerAuth() auth: Required<Auth>): Observable<Mailing[]> {
    return this.mailingService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Mailing)
  mailingById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Mailing> {
    return this.mailingService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Mailing)
  updateMailing(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateMailingArgs: UpdateMailingArgs,
  ): Observable<Mailing> {
    return this.mailingService.update(auth.project.id, updateMailingArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Mailing)
  removeMailing(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Mailing> {
    return this.mailingService.remove(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [MailingWorker])
  findAllMailingWorkers(
    @BearerAuth() auth: Required<Auth>,
    @Args() findAllMailingWorkersArgs: FindAllMailingWorkersDto,
  ): Observable<MailingWorker[]> {
    return this.mailingService.findAllWorkers(
      auth.project.id,
      findAllMailingWorkersArgs,
    );
  }
}
