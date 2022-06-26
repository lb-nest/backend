import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.decorator';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';
import { ContactFlowService } from './contact-flow.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateContactInput } from './dto/create-contact.input';
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

  @Mutation(() => [Contact])
  createContact(
    @Auth() authorization: string,
    @Args() input: CreateContactInput,
  ): Promise<Contact> {
    return this.contactService.create(authorization, input);
  }

  @Query(() => [Contact])
  contacts(@Auth() authorization: string): Promise<Contact[]> {
    return this.contactService.findAll(authorization);
  }

  @Query(() => Contact)
  contactById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  updateContact(
    @Auth() authorization: string,
    @Args() input: UpdateContactInput,
  ): Promise<Contact> {
    return this.contactService.update(authorization, input);
  }

  @Mutation(() => Contact)
  removeContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(authorization, id);
  }

  @Mutation(() => TagWithoutParentAndChildren)
  createContactTag(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.create(authorization, id, tagId);
  }

  @Mutation(() => TagWithoutParentAndChildren)
  removeContactTag(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(authorization, id, tagId);
  }

  @Query(() => [History])
  contactHistory(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<History[]> {
    return this.contactHistoryService.findAll(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  acceptContact(
    @Auth() authorization: string,
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.acceptContact(authorization, id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  closeContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.closeContact(authorization, id);
  }

  @Roles(RoleType.Owner, RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  transferContact(
    @Auth() authorization: string,
    @Args() input: TransferContactInput,
  ): Promise<boolean> {
    return this.contactFlowService.transferContact(authorization, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  returnContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.returnContact(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  reopenContact(
    @Auth() authorization: string,
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.contactFlowService.reopenContact(authorization, id, user.id);
  }
}
