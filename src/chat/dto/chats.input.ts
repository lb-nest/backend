import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ContactStatus } from 'src/contact/enums/contact-status.enum';

@ArgsType()
export class ChatsInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  assignedTo?: number;

  @Field(() => ContactStatus)
  @IsEnum(ContactStatus)
  status: ContactStatus;
}
