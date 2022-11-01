import { Test, TestingModule } from '@nestjs/testing';
import { MailingResolver } from './mailing.resolver';
import { MailingService } from './mailing.service';

describe('MailingResolver', () => {
  let resolver: MailingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailingResolver, MailingService],
    }).compile();

    resolver = module.get<MailingResolver>(MailingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
