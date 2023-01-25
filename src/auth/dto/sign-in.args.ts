import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class SignInArgs {
  @Field(() => String)
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;
}
