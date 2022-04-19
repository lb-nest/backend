import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [ConfigModule],
  providers: [TagResolver, TagService],
})
export class TagModule {}
