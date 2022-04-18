import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { ContactService } from './contact.service';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Query(() => [Contact])
  contacts(@Auth() authorization: string) {
    return this.contactService.findAll(authorization);
  }

  @Query(() => Contact)
  contactById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.findOne(authorization, id);
  }

  @Mutation(() => Contact)
  updateContact(
    @Auth() authorization: string,
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
