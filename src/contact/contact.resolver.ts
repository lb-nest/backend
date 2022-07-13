import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.decorator';
import { RoleType } from 'src/project/enums/role-type.enum';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';
import { ContactFlowService } from './contact-flow.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateContactInput } from './dto/create-contact.input';
import { ImportContactsInput } from './dto/import-contacts.input';
import { TransferContactInput } from './dto/transfer-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
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

  @UseGuards(BearerAuthGuard)
  @Mutation(() => [Contact])
  createContact(
    @User() user: any,
    @Args() input: CreateContactInput,
  ): Promise<Contact> {
    return this.contactService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Contact])
  contacts(@User() user: any): Promise<Contact[]> {
    return this.contactService.findAll(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Contact)
  contactById(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Contact)
  updateContact(
    @User() user: any,
    @Args() input: UpdateContactInput,
  ): Promise<Contact> {
    return this.contactService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Contact)
  removeContact(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  importContacts(
    @User() user: any,
    input: ImportContactsInput,
  ): Promise<boolean> {
    return this.contactService.import(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => TagWithoutParentAndChildren)
  createContactTag(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.create(user, id, tagId);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => TagWithoutParentAndChildren)
  removeContactTag(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(user, id, tagId);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [History])
  contactHistory(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<History[]> {
    return this.contactHistoryService.findAll(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  acceptContact(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.acceptContact(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  closeContact(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.closeContact(user, id);
  }

  @Roles(RoleType.Admin, RoleType.Owner)
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  transferContact(
    @User() user: any,
    @Args() input: TransferContactInput,
  ): Promise<boolean> {
    return this.contactFlowService.transferContact(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  returnContact(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.returnContact(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  reopenContact(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.reopenContact(user, id);
  }
}
