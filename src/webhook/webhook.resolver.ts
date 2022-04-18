import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './webhook.service';

@Resolver(() => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  @Mutation(() => Webhook)
  createWebhook(
    @Headers('authorization') authorization: string,
    @Args() input: CreateWebhookInput,
  ) {
    this.webhookService.create(authorization, input);
  }

  @Query(() => [Webhook])
  webhooks(@Headers('authorization') authorization: string) {
    this.webhookService.findAll(authorization);
  }

  @Query(() => Webhook)
  webhookById(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    this.webhookService.findOne(authorization, id);
  }

  @Mutation(() => Webhook)
  updateWebhook(
    @Headers('authorization') authorization: string,
    @Args() input: UpdateWebhookInput,
  ) {
    this.webhookService.update(authorization, input);
  }

  @Mutation(() => Webhook)
  removeWebhook(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    this.webhookService.remove(authorization, id);
  }
}
