import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HsmResolver } from './hsm.resolver';
import { HsmService } from './hsm.service';

@Module({
  imports: [ConfigModule],
  providers: [HsmResolver, HsmService],
})
export class HsmModule {}
