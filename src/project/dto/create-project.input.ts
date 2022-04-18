import { ArgsType, Field } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class CreateProjectInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;
}
