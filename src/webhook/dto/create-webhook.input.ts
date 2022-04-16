import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';

@ArgsType()
export class CreateWebhookInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsUrl()
  url: string;

  @Field(() => String)
  @IsString()
  type: string;
}
