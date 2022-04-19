import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ContactStatus } from '../enums/contact-status.enum';

@ObjectType()
export class Contact {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string;

  @Field(() => ContactStatus)
  status: ContactStatus;

  @Field(() => Int, { nullable: true })
  assignedTo?: number;
}
