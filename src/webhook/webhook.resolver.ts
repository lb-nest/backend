import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './webhook.service';

@Resolver(() => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  @Mutation(() => Webhook)
  createWebhook(@Context() context: any, @Args() input: CreateWebhookInput) {
    this.webhookService.create(context.req.headers.authorization, input);
  }

  @Query(() => [Webhook])
  webhooks(@Context() context: any) {
    this.webhookService.findAll(context.req.headers.authorization);
  }

  @Query(() => Webhook)
  webhookById(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    this.webhookService.findOne(context.req.headers.authorization, id);
  }

  @Mutation(() => Webhook)
  updateWebhook(@Context() context: any, @Args() input: UpdateWebhookInput) {
    this.webhookService.update(context.req.headers.authorization, input);
  }

  @Mutation(() => Webhook)
  removeWebhook(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    this.webhookService.remove(context.req.headers.authorization, id);
  }
}
