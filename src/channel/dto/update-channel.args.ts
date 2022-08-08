import { ArgsType, Field, Int, PartialType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateChannelArgs } from './create-channel.args';

@ArgsType()
export class UpdateChannelArgs extends PartialType(
  PickType(CreateChannelArgs, ['name'] as const),
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
