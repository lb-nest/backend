import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ButtonType } from '../enums/button-type.enum';

@InputType()
export class CreateButtonInput {
  @Field(() => ButtonType)
  @IsEnum(ButtonType)
  type: ButtonType;

  @Field(() => String)
  @IsString()
  @MaxLength(20)
  text: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((object: CreateButtonInput) => object.type === ButtonType.Url)
  @IsString()
  @IsUrl()
  url?: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((object: CreateButtonInput) => object.type === ButtonType.Phone)
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
