import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';

@Module({
  providers: [AuthResolver, AuthService, BearerStrategy],
  exports: [AuthService],
})
export class AuthModule {}
