import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  upload(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    return this.fileService.upload(file);
  }
}
