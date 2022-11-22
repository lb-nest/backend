import { IsInt } from 'class-validator';
import { CreateContactArgs } from 'src/contact/dto/create-contact.args';

export class HandleWebhookDto extends CreateContactArgs {
  @IsInt()
  channelId: number;
}
