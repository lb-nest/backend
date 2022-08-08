import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateWebhookArgs } from './create-webhook.args';

@ArgsType()
export class UpdateWebhookArgs extends PartialType(CreateWebhookArgs) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
