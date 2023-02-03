import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MailingWorkerStatus } from '../enums/mailing-worker-status.enum';

@ObjectType()
export class MailingWorker {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  contactId: number;

  @Field(() => String)
  accountId: string;

  @Field(() => Int, { nullable: true })
  messageId: number | null;

  @Field(() => Date)
  scheduledAt: Date;

  @Field(() => MailingWorkerStatus)
  status: MailingWorkerStatus;

  @Field(() => String, { nullable: true })
  failedReason: string | null;
}
