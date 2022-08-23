import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { HsmResolver } from './hsm.resolver';
import { HsmService } from './hsm.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [HsmResolver, HsmService],
  exports: [HsmService],
})
export class HsmModule {}
