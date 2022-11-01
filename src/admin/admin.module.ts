import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [AdminResolver, AdminService],
})
export class AdminModule {}
