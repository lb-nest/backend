import { Test, TestingModule } from '@nestjs/testing';
import { FeatureResolver } from './feature.resolver';
import { FeatureService } from './feature.service';

describe('FeatureResolver', () => {
  let resolver: FeatureResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureResolver, FeatureService],
    }).compile();

    resolver = module.get<FeatureResolver>(FeatureResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
