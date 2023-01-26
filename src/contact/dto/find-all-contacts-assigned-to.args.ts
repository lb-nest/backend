import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { ContactStatus } from 'src/contact/enums/contact-status.enum';
import { CreateAssignedToInput } from './create-assigned-to.input';
import { FindAllContactsArgs } from './find-all-contacts.args';

@ArgsType()
export class FindAllContactsAssignedToArgs extends FindAllContactsArgs {
  @Field(() => CreateAssignedToInput, { nullable: true })
  @Type(() => CreateAssignedToInput)
  @IsOptional()
  @ValidateNested()
  assignedTo?: CreateAssignedToInput;

  @Field(() => ContactStatus)
  @IsEnum(ContactStatus)
  status: ContactStatus;
}
