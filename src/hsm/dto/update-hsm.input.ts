import { ArgsType, Field, Int, OmitType, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateHsmInput } from './create-hsm.input';

@ArgsType()
export class UpdateHsmInput extends PartialType(
  OmitType(CreateHsmInput, ['code']),
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
