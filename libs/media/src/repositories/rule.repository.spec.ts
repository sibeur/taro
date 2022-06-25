import { BadRequestException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import upload_option from '../configs/upload_option';
import { MediaRule } from '../entities/media_rule';
import { MediaRuleModel, MediaRuleSchema } from '../schemas/media_rule.schema';
import {
  MediaValidationRule,
  AllowedMimes,
} from '../typesAndInterface/media_rule';
import { RuleRepository } from './rule.repository';

describe('RuleRepository', () => {
  let repo: RuleRepository;

  const dummyDataRuleValidations: MediaValidationRule = {
    maxSize: 1000,
    allowedMimes: [AllowedMimes.GIF],
  };
  const dummyDataRule: MediaRule = {
    name: 'dummy',
    validations: dummyDataRuleValidations,
    options: upload_option,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/taro-test'),
        MongooseModule.forFeature([
          { name: MediaRuleModel.collName, schema: MediaRuleSchema },
        ]),
      ],
      providers: [RuleRepository],
    }).compile();

    repo = module.get<RuleRepository>(RuleRepository);
  });

  it('Repo should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('func getRuleByName', () => {
    let dummyRule: MediaRule;

    beforeEach(async () => {
      dummyRule = await repo.create(dummyDataRule);
    });

    afterEach(async () => {
      await repo.destroyById(dummyRule.id);
    });

    it('data not found', async () => {
      try {
        const randomRuleName = 'dawdasdawd';
        await repo.getRuleByName(randomRuleName);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).message).toBe('Rule not found');
      }
    });

    it('data found', async () => {
      const rule: MediaRule = await repo.getRuleByName(dummyDataRule.name);
      expect(rule.name).toBe(dummyDataRule.name);
    });
  });
});
