import { ArgsType, Field, Int, OmitType, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateHsmArgs } from './create-hsm.args';

@ArgsType()
export class UpdateHsmArgs extends PartialType(
  OmitType(CreateHsmArgs, ['code'] as const),
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
