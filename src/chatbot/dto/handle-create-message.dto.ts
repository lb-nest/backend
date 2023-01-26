import { IsInt } from 'class-validator';
import { CreateMessageArgs } from 'src/message/dto/create-message.args';

export class HandleCreateMessageDto extends CreateMessageArgs {
  @IsInt()
  contactId: number;
}
