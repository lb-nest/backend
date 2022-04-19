import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateWebhookInput } from './create-webhook.input';

@ArgsType()
export class UpdateWebhookInput extends PartialType(CreateWebhookInput) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
