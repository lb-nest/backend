import { IsInt } from 'class-validator';

export class HandleCloseDto {
  @IsInt()
  chatId: number;

  @IsInt()
  id: number;
}
