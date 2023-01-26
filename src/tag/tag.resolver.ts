import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { CreateTagArgs } from './dto/create-tag.args';
import { UpdateTagArgs } from './dto/update-tag.args';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Tag)
  createTag(
    @BearerAuth() auth: Required<Auth>,
    @Args() createTagArgs: CreateTagArgs,
  ): Observable<Tag> {
    return this.tagService.create(auth.project.id, createTagArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Tag])
  tags(@BearerAuth() auth: Required<Auth>): Observable<Tag[]> {
    return this.tagService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Tag)
  tagById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Tag> {
    return this.tagService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Tag)
  updateTag(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateTagArgs: UpdateTagArgs,
  ): Observable<Tag> {
    return this.tagService.update(auth.project.id, updateTagArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Tag)
  removeTag(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Tag> {
    return this.tagService.remove(auth.project.id, id);
  }
}
