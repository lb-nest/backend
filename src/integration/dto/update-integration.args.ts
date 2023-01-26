import { ArgsType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateIntegrationArgs } from './create-integration.args';

@ArgsType()
export class UpdateIntegrationArgs extends PartialType(CreateIntegrationArgs) {
  @Field(() => String)
  @IsString()
  id: string;
}
