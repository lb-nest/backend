import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
