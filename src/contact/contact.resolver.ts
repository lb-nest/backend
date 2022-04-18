import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Query(() => [Contact])
  contacts(@Headers('authorization') authorization: string) {
    return this.contactService.findAll(authorization);
  }

  @Query(() => Contact)
  contactById(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.findOne(authorization, id);
  }

  @Mutation(() => Contact)
  updateContact(
    @Headers('authorization') authorization: string,
    @Args() input: UpdateContactInput,
  ) {
    return this.contactService.update(authorization, input);
  }

  @Mutation(() => Contact)
  removeContact(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.remove(authorization, id);
  }
}
