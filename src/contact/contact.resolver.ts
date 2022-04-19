import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  updateContact(
    @Auth() authorization: string,
    @Context('req') req: any,
    @Args() input: UpdateContactInput,
  ) {
    return this.contactService.update(
      authorization,
      req.user.project.id,
      input,
    );
  }

  @Mutation(() => Contact)
  removeContact(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.contactService.remove(authorization, id);
  }
}
