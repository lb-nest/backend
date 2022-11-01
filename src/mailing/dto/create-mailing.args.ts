import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class CreateMailingArgs {
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

  @Field(() => [Int])
  @IsInt({ each: true })
  tagIds: number[];

  @Field(() => [Int])
  @IsInt({ each: true })
  hsmIds: number[];

  @Field(() => Date)
  @IsOptional()
  @IsDate()
  scheduledAt?: Date;
}
