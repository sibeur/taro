import { Test, TestingModule } from '@nestjs/testing';
import { MediaRepository } from './media.repository';

describe('MediaRepository', () => {
  let repo: MediaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaRepository],
    }).compile();

    repo = module.get<MediaRepository>(MediaRepository);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });
});
