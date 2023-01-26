import { ArgsType } from '@nestjs/graphql';
import { FindAllContactsAssignedToArgs } from 'src/contact/dto/find-all-contacts-assigned-to.args';

@ArgsType()
export class FindAllChatsArgs extends FindAllContactsAssignedToArgs {}
