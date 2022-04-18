import { ArgsType, Field } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@ArgsType()
export class SignupInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }): TransformFnParams => value.trim())
  name: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;
}
