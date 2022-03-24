import { Test, TestingModule } from '@nestjs/testing';
import { MediaRuleController } from './media-rule.controller';

describe('MediaRuleController', () => {
  let controller: MediaRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaRuleController],
    }).compile();

    controller = module.get<MediaRuleController>(MediaRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
