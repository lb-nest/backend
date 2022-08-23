import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateChatArgs {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
