import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class CreateTagArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String)
  @IsString()
  color: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
