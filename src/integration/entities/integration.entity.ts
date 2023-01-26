import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { IntegrationType } from '../enums/integration-type.enum';

@ObjectType()
export class Integration {
  @Field(() => String)
  id: string;

  @Field(() => IntegrationType)
  type: IntegrationType;

  @Field(() => GraphQLJSONObject, { nullable: true })
  payload?: any;
}
