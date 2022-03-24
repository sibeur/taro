import { BadRequestException, Injectable } from '@nestjs/common';
import upload_option from '@core/media/configs/upload_option';
import { MediaRule } from '@core/media/entities/media_rule';
import { Model } from 'mongoose';
import { MediaRuleModel } from '@core/media/schemas/media_rule.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseRQNRepository } from '@core/common/rqn/mongo_repo.rqn';
import { fromJSON } from '@core/common/helpers/entity.helper';

@Injectable()
export class RuleRepository extends MongooseRQNRepository<
  MediaRule,
  MediaRuleModel
> {
  protected filterable: string[] = ['name'];
  protected sortable: string[] = ['name'];
  constructor(
    @InjectModel(MediaRuleModel.collName)
    private mediaRuleModel: Model<MediaRuleModel>,
  ) {
    super(mediaRuleModel);
  }

  async getRuleByName(name: string): Promise<MediaRule> {
    const query = await this.mediaRuleModel.findOne({ name });
    if (!query) throw new BadRequestException('Rule not found');
    const result = fromJSON<MediaRule>(query.toJSON());
    result.options = result.options ?? upload_option;
    return result;
  }
}
