import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MediaModel } from '@core/media/schemas/media.schema';
import { Model } from 'mongoose';
import { Media, MediaStorageStats } from '@core/media/entities/media';
import { DateTime } from 'luxon';
import { MongooseRQNRepository } from '@core/common/rqn/mongo_repo.rqn';
import { fromJSON } from '@core/common/helpers/entity.helper';

@Injectable()
export class MediaRepository extends MongooseRQNRepository<Media, MediaModel> {
  protected filterable: string[] = [
    'aliasName',
    'size',
    'mime',
    'ext',
    'commit',
    'rule.name',
  ];
  protected sortable: string[] = ['aliasName', 'size', 'mime', 'ext'];
  constructor(
    @InjectModel(MediaModel.collName) private mediaModel: Model<MediaModel>,
  ) {
    super(mediaModel);
  }

  async getMedia(ruleName: string, aliasName: string): Promise<Media> {
    const query = await this.mediaModel.findOne({
      'rule.name': ruleName,
      aliasName,
    });
    if (!query) throw new NotFoundException('Media not found');
    return fromJSON<Media>(query.toJSON());
  }

  async getIrrelevantMedia(limit = 1000): Promise<Media[]> {
    const query = await this.mediaModel
      .find(
        {
          commit: false,
          createdAt: { $lt: DateTime.now().minus({ hours: 1 }) },
        },
        { path: 1, rule: 1, aliasName: 1 },
      )
      .sort({ createdAt: 1 })
      .limit(limit);
    return query.map((media) => fromJSON<Media>(media.toJSON()));
  }

  async deleteMediaWith(filter): Promise<void> {
    await this.mediaModel.deleteOne(filter);
  }

  async isRuleHasMedia(id: string): Promise<boolean> {
    const media = await this.mediaModel.findOne({ 'rule.id': id });
    if (!media) return false;
    return true;
  }

  async commitMedias(mediaIds: string[]): Promise<boolean> {
    await this.mediaModel.updateMany(
      {
        _id: { $in: mediaIds },
      },
      { $set: { commit: true } },
    );
    return true;
  }

  async getMediaStorageStats(ruleName?: string): Promise<MediaStorageStats> {
    const query = ruleName ? [{ $match: { 'rule.name': ruleName } }] : [];
    const [resultStats] = await this.mediaModel
      .aggregate([
        ...query,
        {
          $facet: {
            commited: [
              { $match: { commit: true } },
              { $group: { _id: null, count: { $sum: '$size' } } },
            ],
            uncommited: [
              { $match: { commit: false } },
              { $group: { _id: null, count: { $sum: '$size' } } },
            ],
            total: [{ $group: { _id: null, count: { $sum: '$size' } } }],
          },
        },
      ])
      .exec();
    const { commited, uncommited, total } = resultStats;
    return {
      commited: parseInt(commited[0]?.count ?? 0),
      uncommited: parseInt(uncommited[0]?.count ?? 0),
      total: parseInt(total[0]?.count ?? 0),
    };
  }
}
