import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AssigneeType } from '../enums/assignee-type.enum';

@ArgsType()
export class TransferContactArgs {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Int)
  @IsInt()
  assignedTo: number;

  @Field(() => AssigneeType, { nullable: true })
  @IsOptional()
  @IsEnum(AssigneeType)
  type?: AssigneeType;
}
