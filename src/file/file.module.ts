import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from 'src/s3.service';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [ConfigModule],
  providers: [FileResolver, FileService, S3Service],
})
export class FileModule {}
