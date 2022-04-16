import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateProjectInput {
  @Field(() => String)
  @IsString()
  name: string;
}
