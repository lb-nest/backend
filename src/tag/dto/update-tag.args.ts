import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateTagArgs } from './create-tag.args';

@ArgsType()
export class UpdateTagArgs extends PartialType(CreateTagArgs) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
