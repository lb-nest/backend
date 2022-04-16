import { ArgsType, PartialType } from '@nestjs/graphql';
import { CreateWebhookInput } from './create-webhook.input';

@ArgsType()
export class UpdateWebhookInput extends PartialType(CreateWebhookInput) {}
