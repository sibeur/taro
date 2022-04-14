import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MediaRepository } from '@core/media/repositories/media.repository';
import { MediaDeleteEvent } from '../typesAndInterface/event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);
  constructor(
    private mediaRepo: MediaRepository,
    private eventEmitter: EventEmitter2,
  ) {}
  @Cron(CronExpression.EVERY_2_HOURS)
  async cleanMedia() {
    try {
      this.logger.log('Clean uncommit media');
      const medias = await this.mediaRepo.getIrrelevantMedia();
      if (medias.length == 0) {
        this.logger.log('There are no media to delete');
        return;
      }
      this.eventEmitter.emit('media.delete', new MediaDeleteEvent(medias));
      this.logger.log(`Emit to clean ${medias.length} unused media`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
