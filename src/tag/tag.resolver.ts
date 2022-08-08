import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { CreateTagArgs } from './dto/create-tag.args';
import { UpdateTagArgs } from './dto/update-tag.args';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag)
  createTag(
    @GqlHeaders('authorization') authorization: string,
    @Args() createTagArgs: CreateTagArgs,
  ): Observable<Tag> {
    return this.tagService.create(authorization, createTagArgs);
  }

  @Query(() => [Tag])
  tags(@GqlHeaders('authorization') authorization: string): Observable<Tag[]> {
    return this.tagService.findAll(authorization);
  }

  @Query(() => Tag)
  tagById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Tag> {
    return this.tagService.findOne(authorization, id);
  }

  @Mutation(() => Tag)
  updateTag(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateTagArgs: UpdateTagArgs,
  ): Observable<Tag> {
    return this.tagService.update(authorization, updateTagArgs);
  }

  @Mutation(() => Tag)
  removeTag(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Tag> {
    return this.tagService.remove(authorization, id);
  }
}
