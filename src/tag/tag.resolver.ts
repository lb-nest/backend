import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Tag)
  createTag(@User() user: any, @Args() input: CreateTagInput): Promise<Tag> {
    return this.tagService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Tag])
  tags(@User() user: any): Promise<Tag[]> {
    return this.tagService.findAll(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Tag)
  tagById(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Tag> {
    return this.tagService.findOne(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Tag)
  updateTag(@User() user: any, @Args() input: UpdateTagInput): Promise<Tag> {
    return this.tagService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Tag)
  removeTag(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Tag> {
    return this.tagService.remove(user, id);
  }
}
