import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { WebhookEventType } from '../enums/webhook-event-type.enum';

@ArgsType()
export class CreateWebhookArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  url: string;

  @Field(() => WebhookEventType)
  @IsEnum(WebhookEventType)
  eventType: WebhookEventType;
}
