import { ForbiddenException, Injectable } from '@nestjs/common';
import { MongooseRQNService } from '@core/common/rqn/mongo_service.rqn';
import upload_option from '../configs/upload_option';
import { MediaRule } from '../entities/media_rule';
import { RuleRepository } from '../repositories/rule.repository';
import { MediaRuleModel } from '../schemas/media_rule.schema';
import { MediaRepository } from '../repositories/media.repository';

@Injectable()
export class RuleService extends MongooseRQNService<MediaRule, MediaRuleModel> {
  constructor(
    private ruleRepo: RuleRepository,
    private mediaRepo: MediaRepository,
  ) {
    super(ruleRepo);
  }

  async create(data: MediaRule): Promise<MediaRule> {
    if (!data.options) data.options = upload_option;
    if (!data.options?.path) data.options.path = upload_option.path;
    return this.ruleRepo.create(data);
  }

  async destroyById(id: string): Promise<void> {
    const isHasMedia = await this.mediaRepo.isRuleHasMedia(id);
    if (isHasMedia)
      throw new ForbiddenException('Cannot delete rule who has media');
    await this.ruleRepo.destroyById(id);
    return;
  }
}
