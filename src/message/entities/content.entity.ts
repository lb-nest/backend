import { Field, ObjectType } from '@nestjs/graphql';
import { Attachment } from './attachment.entity';
import { Button } from './button.entity';

@ObjectType()
export class Content {
  @Field(() => String, { nullable: true })
  text: string | null;

  @Field(() => [Attachment])
  attachments: Attachment[];

  @Field(() => [Button])
  buttons: Button[];
}
