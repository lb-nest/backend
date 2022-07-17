import { Module } from '@nestjs/common';
import { HsmResolver } from './hsm.resolver';
import { HsmService } from './hsm.service';

@Module({
  providers: [HsmResolver, HsmService],
  exports: [HsmService],
})
export class HsmModule {}
