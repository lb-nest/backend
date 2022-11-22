import { Field, ObjectType } from '@nestjs/graphql';
import { ButtonType } from '../enums/button-type.enum';

@ObjectType()
export class Button {
  @Field(() => ButtonType)
  type: ButtonType;

  @Field(() => String)
  text: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  phone?: string;
}
