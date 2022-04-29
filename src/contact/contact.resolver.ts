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
import { ContactService } from './contact.service';
import { TransferContactInput } from './dto/transfer-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';
import { ContactsCount } from './entities/contacts-count.entity';
import { HistoryEvent } from './entities/history-event.entity';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactFlowService: ContactFlowService,
  ) {}

  @Query(() => [Contact])
  contacts(@Auth() authorization: string) {
    return this.contactService.findAll(authorization);
  }

  @Query(() => ContactsCount)
  contactsCount(@Auth() authorization: string) {
    return this.contactService.count(authorization);
  }

  @Query(() => Contact)
  contactById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.findOne(authorization, id);
  }

  @Mutation(() => TagWithoutParentAndChildren)
  addContactTag(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ) {
    return this.contactService.addTag(authorization, id, tagId);
  }

  @Mutation(() => TagWithoutParentAndChildren)
  delContactTag(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ) {
    return this.contactService.delTag(authorization, id, tagId);
  }

  @Query(() => [HistoryEvent])
  contactHistory(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.getHistory(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  acceptContact(
    @Auth() authorization: string,
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactFlowService.acceptContact(authorization, id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  closeContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactFlowService.closeContact(authorization, id);
  }

  @Roles(RoleType.Owner, RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Contact)
  transferContact(
    @Auth() authorization: string,
    @Args() input: TransferContactInput,
  ) {
    return this.contactFlowService.transferContact(authorization, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  returnContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactFlowService.returnContact(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  reopenContact(
    @Auth() authorization: string,
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactFlowService.reopenContact(authorization, id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  updateContact(
    @Auth() authorization: string,
    @User() user: any,
    @Args() input: UpdateContactInput,
  ) {
    return this.contactService.update(authorization, input);
  }

  @Mutation(() => Contact)
  removeContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.remove(authorization, id);
  }
}
