import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsHexColor, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

@ArgsType()
export class CreateTagInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @Field(() => String)
  @IsOptional()
  description?: string;

  @Field(() => String)
  @IsHexColor()
  color: string;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  parentId?: number;
}
