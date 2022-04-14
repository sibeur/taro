import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MediaRepository } from '../repositories/media.repository';
import { MediaDeleteEvent } from '../typesAndInterface/event';
import { MediaStorageOption } from '../typesAndInterface/media_rule';
import * as fs from 'fs';
import { promisify } from 'util';
const unlink = promisify(fs.unlink);

@Injectable()
export class MediaEventService {
  private readonly logger = new Logger(MediaEventService.name);
  constructor(private readonly mediaRepo: MediaRepository) {}

  @OnEvent('media.delete', { async: true })
  async handleMediaDeleteDBEvent(payload: MediaDeleteEvent) {
    try {
      const medias = payload.media.map(async (media) => {
        if (media.rule.options.storage === MediaStorageOption.DRIVE) {
          if (fs.existsSync(media.path)) unlink(media.path);
          this.logger.log(
            `file media[${media.rule.name}]: ${media.aliasName} deleted`,
          );
        }
      });
      await Promise.all(medias);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @OnEvent('media.delete', { async: true })
  async handleMediaDeleteFileEvent(payload: MediaDeleteEvent) {
    try {
      const medias = payload.media.map((media) => {
        this.logger.log(
          `data media[${media.rule.name}]: ${media.aliasName} deleted`,
        );
        return media.id;
      });
      await this.mediaRepo.destroyManyByIds(medias);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
