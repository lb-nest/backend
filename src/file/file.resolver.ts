import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => String)
  upload(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    return this.fileService.upload(
      file.createReadStream(),
      file.filename,
      file.mimetype,
    );
  }
}
