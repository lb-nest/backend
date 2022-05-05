import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { HistoryEventType } from '../enums/history-event-type.enum';

@ObjectType()
export class History {
  @Field(() => Int)
  id: number;

  @Field(() => HistoryEventType)
  eventType: HistoryEventType;

  @Field(() => GraphQLJSON, { nullable: true })
  payload?: any;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
