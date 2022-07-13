import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    RabbitMQModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserResolver, UserService],
})
export class UserModule {}
