import { ObjectType } from '@nestjs/graphql';
import { ContactsCount } from 'src/contact/entities/contacts-count.entity';

@ObjectType()
export class ChatsCount extends ContactsCount {}
