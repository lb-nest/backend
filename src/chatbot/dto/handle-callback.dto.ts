import { IsInt } from 'class-validator';

export class HandleCallbackDto {
  @IsInt()
  contactId: number;
}
