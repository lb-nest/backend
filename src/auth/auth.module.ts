import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { BearerAuthGuard } from './bearer-auth.guard';

@Module({
  imports: [ConfigModule, PassportModule],
  providers: [BearerAuthGuard, AuthResolver, AuthService],
})
export class AuthModule {}
