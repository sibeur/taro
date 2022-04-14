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
    commit: boolean,
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

  async getMediaStorageStats(ruleName?: string): Promise<unknown> {
    const stats = await this.media.getMediaStorageStats(ruleName);
    console.log(stats);
    return {
      commited: stats?.commited ? this.formatSizeUnits(stats.commited) : '',
      uncommited: stats?.uncommited
        ? this.formatSizeUnits(stats.uncommited)
        : '',
      commitedPercentage: (stats.commited / stats.total) * 100,
      uncommitedPercentage: (stats.uncommited / stats.total) * 100,
      total: this.formatSizeUnits(stats.total),
    };
  }

  async dropRuleById(ruleId: string): Promise<void> {
    await this.rule.destroyById(ruleId);
  }

  private formatSizeUnits(kb) {
    if (kb >= 1073741824) {
      kb = (kb / 1073741824).toFixed(2) + ' TB';
    } else if (kb >= 1048576) {
      kb = (kb / 1048576).toFixed(2) + ' GB';
    } else if (kb >= 1024) {
      kb = (kb / 1024).toFixed(2) + ' MB';
    } else if (kb > 1) {
      kb = kb + ' KB';
    } else {
      kb = '0 byte';
    }
    return kb;
  }
}
