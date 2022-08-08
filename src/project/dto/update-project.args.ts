import { ArgsType, PartialType } from '@nestjs/graphql';
import { CreateProjectArgs } from './create-project.args';

@ArgsType()
export class UpdateProjectArgs extends PartialType(CreateProjectArgs) {}
