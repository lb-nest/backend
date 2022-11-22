import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Attachment } from 'src/message/entities/attachment.entity';
import { Button } from 'src/message/entities/button.entity';
import { Approval } from './approval.entity';

@ObjectType()
export class Hsm {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  code: string;

  @Field(() => String)
  text: string;

  @Field(() => [Attachment])
  attachments: Attachment[];

  @Field(() => [Button])
  buttons: Button[];

  @Field(() => [Approval])
  approval: Approval[];
}
