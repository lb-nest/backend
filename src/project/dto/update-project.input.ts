import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateProjectInput } from './create-project.input';

@ArgsType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
