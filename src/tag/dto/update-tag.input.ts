import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateTagInput } from './create-tag.input';

@ArgsType()
export class UpdateTagInput extends PartialType(CreateTagInput) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
