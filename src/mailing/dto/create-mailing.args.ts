import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { MailingStatus } from '../enums/mailing-status.enum';

@ArgsType()
export class CreateMailingArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String)
  @IsString()
  color: string;

  @Field(() => Int)
  @IsInt()
  channelId: number;

  @Field(() => [Int])
  @IsInt({ each: true })
  tagIds: number[];

  @Field(() => [Int])
  @IsInt({ each: true })
  hsmIds: number[];

  @Field(() => MailingStatus, { nullable: true })
  @IsIn([MailingStatus.Disabled, MailingStatus.Scheduled])
  status?: MailingStatus;

  @Field(() => Date)
  @IsOptional()
  @IsDate()
  scheduledAt?: Date;
}
