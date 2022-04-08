import { MediaRule } from '@core/media/entities/media_rule';
import { RuleService } from '@core/media/services/rule.service';
import { allowedMimeObjects } from '@core/media/typesAndInterface/media_rule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaroAdminService {
  constructor(private readonly rule: RuleService) {}
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
}
