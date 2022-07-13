import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';

@Module({
  imports: [
    PassportModule,
    RabbitMQModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [AuthResolver, AuthService, BearerStrategy],
  exports: [AuthResolver, AuthService],
})
export class AuthModule {}
