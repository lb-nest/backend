import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ContactStatus } from '../enums/contact-status.enum';
import { CreateAssignedToInput } from './create-assigned-to.input';

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

  // @Field(() => [CreateAssignedToInput], { nullable: true })
  @IsOptional()
  @ValidateNested()
  assignedTo?: CreateAssignedToInput | null;

  // @Field(() => ContactStatus, { nullable: true })
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
