import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, ValidateNested } from 'class-validator';
import { CreateContactWithoutChannelId } from './create-contact-without-channel-id.input';

@ArgsType()
export class ImportContactsInput {
  @Field(() => Int)
  @IsInt()
  channelId: number;

  @Field(() => [CreateContactWithoutChannelId])
  @ValidateNested({ each: true })
  contacts: CreateContactWithoutChannelId[];
}
