import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './webhook.service';

@Resolver(() => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  createWebhook(
    @User() user: any,
    @Args() input: CreateWebhookInput,
  ): Promise<Webhook> {
    return this.webhookService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Webhook])
  webhooks(@User() user: any): Promise<Webhook[]> {
    return this.webhookService.findAll(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Webhook)
  webhookById(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Webhook> {
    return this.webhookService.findOne(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  updateWebhook(
    @User() user: any,
    @Args() input: UpdateWebhookInput,
  ): Promise<Webhook> {
    return this.webhookService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Webhook)
  removeWebhook(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Webhook> {
    return this.webhookService.remove(user, id);
  }
}
