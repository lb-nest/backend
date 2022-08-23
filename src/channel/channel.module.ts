import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [ChannelResolver, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
