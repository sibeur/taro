import { Test, TestingModule } from '@nestjs/testing';
import { RuleRepository } from './rule.repository';

describe('Rule', () => {
  let repo: RuleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [RuleRepository],
    }).compile();

    repo = module.get<RuleRepository>(RuleRepository);
  });
});
