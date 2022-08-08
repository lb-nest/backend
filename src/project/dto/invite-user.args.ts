import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class InviteUserArgs {
  @Field(() => String)
  @IsString()
  email: string;
}
