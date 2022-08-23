import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

@ArgsType()
export class CreateContactArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  telegramId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  whatsappId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  webchatId?: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  tags?: number[];
}
