import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [TagResolver, TagService],
})
export class TagModule {}
