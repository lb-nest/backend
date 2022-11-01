import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

@ObjectType()
export class Feature
  implements Pick<Prisma.Project, 'integrations' | 'mailings'>
{
  @Field(() => Boolean)
  integrations: boolean;

  @Field(() => Boolean)
  mailings: boolean;
}
