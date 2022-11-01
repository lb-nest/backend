import { Field, ObjectType } from '@nestjs/graphql';
import { IntegrationType } from '../enums/integration-type.enum';

@ObjectType()
export class Integration {
  @Field(() => String)
  id: string;

  @Field(() => IntegrationType)
  type: IntegrationType;
}
