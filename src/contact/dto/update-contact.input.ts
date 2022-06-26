import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@ArgsType()
export class UpdateContactInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  tags?: number[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  resolved?: boolean;
}
