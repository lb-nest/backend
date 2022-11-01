import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { FeatureResolver } from './feature.resolver';
import { FeatureService } from './feature.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [FeatureResolver, FeatureService, PrismaService],
})
export class FeatureModule {}
