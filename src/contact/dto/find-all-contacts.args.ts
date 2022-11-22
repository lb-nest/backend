import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FindAllContactsArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  cursor?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  take?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  query?: string;
}
