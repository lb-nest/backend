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

  @Field(() => [Int])
  tagIds: number[];

  @Field(() => [Int])
  hsmIds: number[];

  @Field(() => MailingStatus)
  status: MailingStatus;

  @Field(() => Date, { nullable: true })
  scheduledAt: Date | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
