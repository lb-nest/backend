import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [ConfigModule],
  providers: [FileResolver, FileService],
})
export class FileModule {}
