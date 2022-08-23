import { ArgsType, PartialType } from '@nestjs/graphql';
import { CreateMessageArgs } from './create-message.args';

@ArgsType()
export class UpdateMessageArgs extends PartialType(CreateMessageArgs) {}
