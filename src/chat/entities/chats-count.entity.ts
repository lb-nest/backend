import { ObjectType } from '@nestjs/graphql';
import { CountAllContactsAssignedTo } from 'src/contact/entities/count-all-contacts-assigned-to.entity';

@ObjectType()
export class ChatsCount extends CountAllContactsAssignedTo {}
