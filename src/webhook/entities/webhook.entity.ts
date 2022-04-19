import { Field, Int, ObjectType } from '@nestjs/graphql';
import { WebhookEventType } from '../enums/webhook-event-type.enum';

@ObjectType()
export class Webhook {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => WebhookEventType)
  eventType: WebhookEventType;
}
