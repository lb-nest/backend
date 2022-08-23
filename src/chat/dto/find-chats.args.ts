import { ArgsType } from '@nestjs/graphql';
import { FindAllContactsForUserArgs } from 'src/contact/dto/find-all-contacts-for-user.args';

@ArgsType()
export class FindAllChatsForUserArgs extends FindAllContactsForUserArgs {}
