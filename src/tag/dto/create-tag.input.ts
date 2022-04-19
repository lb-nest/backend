import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsHexColor, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

@ArgsType()
export class CreateTagInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String)
  @IsHexColor()
  color: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
