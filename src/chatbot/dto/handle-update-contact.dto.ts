import { IsInt } from 'class-validator';
import { UpdateContactArgs } from 'src/contact/dto/update-contact.args';

export class HandleUpdateContactDto extends UpdateContactArgs {
  @IsInt()
  chatId: number;
}
