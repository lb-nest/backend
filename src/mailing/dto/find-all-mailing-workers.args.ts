import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';

@ArgsType()
export class FindAllMailingWorkersDto {
  @Field(() => Int)
  @IsInt()
  mailingId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  skip?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  take?: number;
}
