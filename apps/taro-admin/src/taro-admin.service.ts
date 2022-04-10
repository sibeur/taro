import { RQNPaginateResult } from '@core/common/rqn/rqn.base';
import { Media } from '@core/media/entities/media';
import { MediaRule } from '@core/media/entities/media_rule';
import { MediaService } from '@core/media/services/media.service';
import { RuleService } from '@core/media/services/rule.service';
import { allowedMimeObjects } from '@core/media/typesAndInterface/media_rule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaroAdminService {
  constructor(
    private readonly rule: RuleService,
    private readonly media: MediaService,
  ) {}
  async getRules(): Promise<unknown> {
    return this.rule.find({
      select: 'name',
    });
  }

  async getMimes() {
    return allowedMimeObjects();
  }

  async getTemplateData() {
    const [rules, mimes] = await Promise.all([
      this.getRules(),
      this.getMimes(),
    ]);
    return { rules, mimes };
  }

  async getRulesById(ruleId: string): Promise<MediaRule> {
    return this.rule.findById(ruleId);
  }

  async getFirstPageMediaByRuleId(
    ruleId: string,
    commit = true,
  ): Promise<unknown> {
    const medias = (await this.media.find({
      select: 'aliasName,size,mime,ext,url',
      filter: {
        'rule.id': ruleId,
        commit,
      },
      paginate: {
        page: 1,
        limit: 25,
      },
    })) as RQNPaginateResult<Media>;
    return medias.results;
  }
}
