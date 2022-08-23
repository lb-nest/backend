import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SignupArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Field(() => String)
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;
}
