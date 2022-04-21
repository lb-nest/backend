import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ArgsType()
export class TransferContactInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Int)
  @IsInt()
  assignedTo: number;
}
