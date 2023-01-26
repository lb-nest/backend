import { ArgsType } from '@nestjs/graphql';
import { FindAllContactsWithQueryArgs } from 'src/contact/dto/find-all-contacts-with-query.args';

@ArgsType()
export class FindAllChatsWithQueryArgs extends FindAllContactsWithQueryArgs {}
