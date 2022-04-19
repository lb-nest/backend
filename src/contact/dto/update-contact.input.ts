import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@ArgsType()
export class UpdateContactInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: number[];
}
