import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';

@Module({
  imports: [ConfigModule],
  providers: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
