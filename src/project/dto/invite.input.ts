import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class InviteInput {
  @Field(() => String)
  @IsEmail()
  email: string;
}
