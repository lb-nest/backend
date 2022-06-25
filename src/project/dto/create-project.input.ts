import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class CreateProjectInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;
}
