import { Module } from '@nestjs/common';
import { MESSAGING_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { HsmResolver } from './hsm.resolver';
import { HsmService } from './hsm.service';

@Module({
  imports: [
    RabbitMQModule.register({
      name: MESSAGING_SERVICE,
    }),
  ],
  providers: [HsmResolver, HsmService],
  exports: [HsmResolver, HsmService],
})
export class HsmModule {}
