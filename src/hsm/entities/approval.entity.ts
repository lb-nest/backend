import { Field, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channel/entities/channel.entity';
import { ApprovalStatus } from '../enums/approval-status.enum';

@ObjectType()
export class Approval {
  @Field(() => Channel)
  channel: Channel;

  @Field(() => ApprovalStatus)
  status: ApprovalStatus;
}
