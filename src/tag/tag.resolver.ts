import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag)
  createTag(
    @Auth() authorization: string,
    @Args() input: CreateTagInput,
  ): Promise<Tag> {
    return this.tagService.create(authorization, input);
  }

  @Query(() => [Tag])
  tags(@Auth() authorization: string): Promise<Tag[]> {
    return this.tagService.findAll(authorization);
  }

  @Query(() => Tag)
  tagById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Tag> {
    return this.tagService.findOne(authorization, id);
  }

  @Mutation(() => Tag)
  updateTag(
    @Auth() authorization: string,
    @Args() input: UpdateTagInput,
  ): Promise<Tag> {
    return this.tagService.update(authorization, input);
  }

  @Mutation(() => Tag)
  removeTag(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Tag> {
    return this.tagService.remove(authorization, id);
  }
}
