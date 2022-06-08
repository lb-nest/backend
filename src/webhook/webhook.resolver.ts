import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './webhook.service';

@Resolver(() => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  @Mutation(() => Webhook)
  createWebhook(
    @Auth() authorization: string,
    @Args() input: CreateWebhookInput,
  ): Promise<Webhook> {
    return this.webhookService.create(authorization, input);
  }

  @Query(() => [Webhook])
  webhooks(@Auth() authorization: string): Promise<Webhook[]> {
    return this.webhookService.findAll(authorization);
  }

  @Query(() => Webhook)
  webhookById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Webhook> {
    return this.webhookService.findOne(authorization, id);
  }

  @Mutation(() => Webhook)
  updateWebhook(
    @Auth() authorization: string,
    @Args() input: UpdateWebhookInput,
  ): Promise<Webhook> {
    return this.webhookService.update(authorization, input);
  }

  @Mutation(() => Webhook)
  removeWebhook(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Webhook> {
    return this.webhookService.remove(authorization, id);
  }
}
