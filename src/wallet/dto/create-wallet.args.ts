import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class CreateWalletArgs {
  @Field(() => String)
  @IsString()
  country: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;
}
