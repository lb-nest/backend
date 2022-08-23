import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { CreateContactArgs } from './create-contact.args';

@ArgsType()
export class UpdateContactArgs extends PartialType(CreateContactArgs) {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  resolved?: boolean;
}
