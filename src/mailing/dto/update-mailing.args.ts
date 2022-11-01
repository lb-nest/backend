import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateMailingArgs } from './create-mailing.args';

@ArgsType()
export class UpdateMailingArgs extends PartialType(CreateMailingArgs) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
