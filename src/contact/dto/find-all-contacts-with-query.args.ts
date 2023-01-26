import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { FindAllContactsArgs } from './find-all-contacts.args';

@ArgsType()
export class FindAllContactsWithQueryArgs extends FindAllContactsArgs {
  @Field(() => String)
  @IsString()
  query: string;
}
