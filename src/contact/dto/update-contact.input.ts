import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UpdateContactInput {
  @Field(() => Int)
  id: number;
}
