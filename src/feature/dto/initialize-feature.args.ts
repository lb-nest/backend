import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class InitializeFeatureArgs {
  id: number;

  @Field(() => Boolean, { nullable: true })
  billing?: boolean;

  @Field(() => Boolean, { nullable: true })
  integrations?: boolean;

  @Field(() => Boolean, { nullable: true })
  mailings?: boolean;
}
