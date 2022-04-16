import { ArgsType, PartialType } from '@nestjs/graphql';
import { CreateProjectInput } from './create-project.input';

@ArgsType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {}
