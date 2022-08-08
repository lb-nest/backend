import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { WebhookEventType } from '../enums/webhook-event-type.enum';

@ArgsType()
export class CreateWebhookArgs {
  @Field(() => String)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsUrl()
  url: string;

  @Field(() => WebhookEventType)
  @IsEnum(WebhookEventType)
  eventType: WebhookEventType;
}
