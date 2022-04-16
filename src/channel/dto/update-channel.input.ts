import { ArgsType, Field, Int, PartialType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateChannelInput } from './create-channel.input';

@ArgsType()
export class UpdateChannelInput extends PartialType(
  PickType(CreateChannelInput, ['name']),
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
