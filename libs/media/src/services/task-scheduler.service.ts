import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MediaRepository } from '@core/media/repositories/media.repository';
import * as fs from 'fs';
import { promisify } from 'util';
import { MediaStorageOption } from '@core/media/typesAndInterface/media_rule';
const unlink = promisify(fs.unlink);

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);
  constructor(private mediaRepo: MediaRepository) {}
  @Cron(CronExpression.EVERY_2_HOURS)
  async cleanMedia() {
    try {
      this.logger.log('Clean uncommit media');
      const medias = await this.mediaRepo.getIrrelevantMedia();
      if (medias.length == 0) {
        this.logger.log('There are no media to delete');
        return;
      }
      const bulkDeleteMedia = medias.map(async (media) => {
        if (media.rule.options.storage === MediaStorageOption.DRIVE) {
          if (fs.existsSync(media.path)) unlink(media.path);
        }
        await this.mediaRepo.deleteMediaWith({ aliasName: media.aliasName });
        this.logger.log(
          `media[${media.rule.name}]: ${media.aliasName} deleted`,
        );
      });
      await Promise.all(bulkDeleteMedia);
      this.logger.log(`Success to clean ${medias.length} unused media`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
