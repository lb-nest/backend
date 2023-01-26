import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateContactArgs } from './dto/create-contact.args';
import { FindAllContactsArgs } from './dto/find-all-contacts.args';
import { UpdateContactArgs } from './dto/update-contact.args';
import { Contact } from './entities/contact.entity';
import { History } from './entities/history.entity';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactHistoryService: ContactHistoryService,
    private readonly contactTagService: ContactTagService,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  importContacts(
    @BearerAuth() auth: Required<Auth>,
    @Args('csvOrXls', { type: () => GraphQLUpload }) csvOrXls: FileUpload,
  ): Observable<boolean> {
    return this.contactService.import(auth.project.id, csvOrXls);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Contact)
  createContact(
    @BearerAuth() auth: Required<Auth>,
    @Args() createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    return this.contactService.create(auth.project.id, createContactArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Contact])
  contacts(
    @BearerAuth() auth: Required<Auth>,
    @Args() findAllContactsArgs: FindAllContactsArgs,
  ): Promise<Contact[]> {
    return this.contactService.findAll(auth.project.id, findAllContactsArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Contact)
  contactById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Contact)
  updateContact(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateContactArgs: UpdateContactArgs,
  ): Promise<Contact> {
    return this.contactService.update(auth.project.id, updateContactArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Contact)
  removeContact(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => TagWithoutParentAndChildren)
  createContactTag(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.contactTagService.create(auth.project.id, id, tagId);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => TagWithoutParentAndChildren)
  removeContactTag(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(auth.project.id, id, tagId);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [History])
  contactHistory(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<History[]> {
    return this.contactHistoryService.findAll(auth.project.id, id);
  }
}
