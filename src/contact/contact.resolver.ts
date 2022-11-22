import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';
import { ContactFlowService } from './contact-flow.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateContactArgs } from './dto/create-contact.args';
import { FindAllContactsArgs } from './dto/find-all-contacts.args';
import { TransferContactArgs } from './dto/transfer-contact.args';
import { UpdateContactArgs } from './dto/update-contact.args';
import { Contact } from './entities/contact.entity';
import { History } from './entities/history.entity';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactFlowService: ContactFlowService,
    private readonly contactHistoryService: ContactHistoryService,
    private readonly contactTagService: ContactTagService,
  ) {}

  @Mutation(() => Boolean)
  importContacts(
    @GqlHeaders('authorization') authorization: string,
    @Args('csvOrXls', { type: () => GraphQLUpload }) csvOrXls: FileUpload,
  ): Observable<boolean> {
    return this.contactService.import(authorization, csvOrXls);
  }

  @Mutation(() => Contact)
  createContact(
    @GqlHeaders('authorization') authorization: string,
    @Args() createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    return this.contactService.create(authorization, createContactArgs);
  }

  @Query(() => [Contact])
  contacts(
    @GqlHeaders('authorization') authorization: string,
    @Args() findAllContactsArgs: FindAllContactsArgs,
  ): Promise<Contact[]> {
    return this.contactService.findAll(authorization, findAllContactsArgs);
  }

  @Query(() => Contact)
  contactById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(authorization, id);
  }

  @Mutation(() => Contact)
  updateContact(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateContactArgs: UpdateContactArgs,
  ): Promise<Contact> {
    return this.contactService.update(authorization, updateContactArgs);
  }

  @Mutation(() => Contact)
  removeContact(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(authorization, id);
  }

  @Mutation(() => TagWithoutParentAndChildren)
  createContactTag(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.contactTagService.create(authorization, id, tagId);
  }

  @Mutation(() => TagWithoutParentAndChildren)
  removeContactTag(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(authorization, id, tagId);
  }

  @Query(() => [History])
  contactHistory(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<History[]> {
    return this.contactHistoryService.findAll(authorization, id);
  }

  @Mutation(() => Boolean)
  acceptContact(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.accept(authorization, id);
  }

  @Mutation(() => Boolean)
  closeContact(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.close(authorization, id);
  }

  @Mutation(() => Boolean)
  transferContact(
    @GqlHeaders('authorization') authorization: string,
    @Args() transferContactArgs: TransferContactArgs,
  ): Promise<boolean> {
    return this.contactFlowService.transfer(authorization, transferContactArgs);
  }

  @Mutation(() => Boolean)
  returnContact(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.return(authorization, id);
  }

  @Mutation(() => Boolean)
  reopenContact(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.reopen(authorization, id);
  }
}
