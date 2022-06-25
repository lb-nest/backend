import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { WebhookEventType } from '../enums/webhook-event-type.enum';

@ArgsType()
export class CreateWebhookInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @Field(() => String)
  @IsUrl()
  url: string;

  @Field(() => WebhookEventType)
  @IsEnum(WebhookEventType)
  eventType: WebhookEventType;
}
