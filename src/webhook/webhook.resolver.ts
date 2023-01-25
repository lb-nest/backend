import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { CreateWebhookArgs } from './dto/create-webhook.args';
import { UpdateWebhookArgs } from './dto/update-webhook.args';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './webhook.service';

@Resolver(() => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  createWebhook(
    @BearerAuth() auth: Required<Auth>,
    @Args() createWebhookArgs: CreateWebhookArgs,
  ): Observable<Webhook> {
    return this.webhookService.create(auth.project.id, createWebhookArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Webhook])
  webhooks(@BearerAuth() auth: Required<Auth>): Observable<Webhook[]> {
    return this.webhookService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Webhook)
  webhookById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Webhook> {
    return this.webhookService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  updateWebhook(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateWebhookArgs: UpdateWebhookArgs,
  ): Observable<Webhook> {
    return this.webhookService.update(auth.project.id, updateWebhookArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  removeWebhook(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Webhook> {
    return this.webhookService.remove(auth.project.id, id);
  }
}
