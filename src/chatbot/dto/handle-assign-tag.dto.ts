import { IsInt } from 'class-validator';

export class HandleAssignTagDto {
  @IsInt()
  chatId: number;

  @IsInt()
  id: number;

  @IsInt()
  tagId: number;
}
