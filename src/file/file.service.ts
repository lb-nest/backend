import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { S3Service } from 'src/s3.service';

@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  async upload(file: FileUpload): Promise<string> {
    return this.s3Service.upload(
      file.createReadStream(),
      file.filename,
      file.mimetype,
    );
  }
}
