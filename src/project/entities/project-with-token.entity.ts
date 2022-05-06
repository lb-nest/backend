import { Field, ObjectType } from '@nestjs/graphql';
import { Token } from 'src/auth/entities/token.entity';
import { Project } from './project.entity';

@ObjectType()
export class ProjectWithToken extends Project {
  @Field(() => Token)
  token: Token;
}
