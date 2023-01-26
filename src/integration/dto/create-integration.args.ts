import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { IntegrationType } from '../enums/integration-type.enum';

@ArgsType()
export class CreateIntegrationArgs {
  @Field(() => IntegrationType)
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @Field(() => String)
  @IsString()
  accountId: string;

  @Field(() => String, { nullable: true })
  @ValidateIf(
    (object: CreateIntegrationArgs) => object.type === IntegrationType.Bitrix,
  )
  @IsString()
  token?: string;
}
