import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/auth.decorator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
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
    @Auth() auth: Required<TokenPayload>,
    @Args() createWebhookArgs: CreateWebhookArgs,
  ): Observable<Webhook> {
    return this.webhookService.create(auth.project.id, createWebhookArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Webhook])
  webhooks(@Auth() auth: Required<TokenPayload>): Observable<Webhook[]> {
    return this.webhookService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Webhook)
  webhookById(
    @Auth() auth: Required<TokenPayload>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Webhook> {
    return this.webhookService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  updateWebhook(
    @Auth() auth: Required<TokenPayload>,
    @Args() updateWebhookArgs: UpdateWebhookArgs,
  ): Observable<Webhook> {
    return this.webhookService.update(auth.project.id, updateWebhookArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  removeWebhook(
    @Auth() auth: Required<TokenPayload>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Webhook> {
    return this.webhookService.remove(auth.project.id, id);
  }
}
