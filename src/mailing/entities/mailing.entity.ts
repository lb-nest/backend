import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MailingStatus } from '../enums/mailing-status.enum';

@ObjectType()
export class Mailing {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  color: string;

  @Field(() => Int)
  channelId: number;

  @Field(() => [Int])
  tagIds: number[];

  @Field(() => [Int])
  hsmIds: number[];

  @Field(() => MailingStatus)
  status: MailingStatus;

  @Field(() => String, { nullable: true })
  scheduledAt: string | null;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
