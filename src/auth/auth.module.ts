import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppModule } from 'src/app.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { BearerStrategy } from './strategies/bearer.strategy';

@Module({
  imports: [forwardRef(() => AppModule), PassportModule],
  providers: [AuthResolver, AuthService, BearerStrategy],
})
export class AuthModule {}
