import { Module } from '@nestjs/common';
import { CONTACTS_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [
    RabbitMQModule.register({
      name: CONTACTS_SERVICE,
    }),
  ],
  providers: [TagResolver, TagService],
  exports: [TagResolver, TagService],
})
export class TagModule {}
