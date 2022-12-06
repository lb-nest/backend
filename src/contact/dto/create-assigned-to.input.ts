import { InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AssigneeType } from '../enums/assignee-type.enum';

@InputType()
export class CreateAssignedToInput {
  @IsInt()
  id: number;

  @IsOptional()
  @IsEnum(AssigneeType)
  type?: AssigneeType;
}
