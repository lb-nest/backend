import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
