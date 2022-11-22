import { IsInt } from 'class-validator';
import { TransferContactArgs } from 'src/contact/dto/transfer-contact.args';

export class HandleTransferDto extends TransferContactArgs {
  @IsInt()
  chatId: number;
}
