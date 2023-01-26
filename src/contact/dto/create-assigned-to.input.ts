import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AssigneeType } from '../enums/assignee-type.enum';

@InputType()
export class CreateAssignedToInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => AssigneeType, { nullable: true })
  @IsOptional()
  @IsEnum(AssigneeType)
  type?: AssigneeType;
}
