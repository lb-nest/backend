import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateProjectArgs {
  @Field(() => String)
  @IsString()
  name: string;
}
