import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [UserResolver, UserService],
})
export class UserModule {}
