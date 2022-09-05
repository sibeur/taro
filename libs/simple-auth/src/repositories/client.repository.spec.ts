import { Test, TestingModule } from '@nestjs/testing';
import { ImplClientDBRepository } from './client-db.repository';

describe('ClientRepository', () => {
  let service: ImplClientDBRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImplClientDBRepository],
    }).compile();

    service = module.get<ImplClientDBRepository>(ImplClientDBRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
