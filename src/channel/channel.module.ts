import { Module } from '@nestjs/common';
import { MESSAGING_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    RabbitMQModule.register({
      name: MESSAGING_SERVICE,
    }),
  ],
  providers: [ChannelResolver, ChannelService],
  exports: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
