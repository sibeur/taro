import { BadRequestException, Injectable } from '@nestjs/common';
import { RuleRepository } from '@core/media/repositories/rule.repository';
import { Media, MediaStorageStats } from '@core/media/entities/media';
import {
  IUploadMedia,
  MediaFileObject,
  MediaFileStream,
  MediaResult,
} from '@core/media/typesAndInterface/media';
import { MediaRepository } from '@core/media/repositories/media.repository';
import {
  AllowedMimes,
  MediaRuleOptions,
  MediaStorageOption,
  MediaValidationRule,
} from '../typesAndInterface/media_rule';
import { DriveStore } from '../base/stores/drive_store.base';
import { join } from 'path';
import { createReadStream } from 'fs';
import { MediaRule } from '../entities/media_rule';
import { RQNService } from '@core/common/rqn/service.rqn';
import { RQNFilterable } from '@core/common/rqn/rqn.base';

@Injectable()
export class MediaService extends RQNService<Media> {
  constructor(
    private ruleRepo: RuleRepository,
    private mediaRepo: MediaRepository,
  ) {
    super(mediaRepo);
  }

  async upload(
    uploadData: IUploadMedia,
    isCommit: boolean,
  ): Promise<MediaResult> {
    await this.validateRule(uploadData);
    return this.storeMedia(uploadData, isCommit);
  }

  async openMedia(
    ruleName: string,
    aliasName: string,
  ): Promise<MediaFileStream> {
    const {
      aliasName: fileName,
      path,
      mime,
      size,
      rule,
    } = await this.mediaRepo.getMedia(ruleName, aliasName);
    let file = null;
    switch (rule.options.storage) {
      case MediaStorageOption.DRIVE:
        file = createReadStream(join(process.cwd(), path));
        break;
    }
    return {
      file,
      fileMime: mime as AllowedMimes,
      fileName,
      fileSize: Math.round(size),
    };
  }

  async commitMedias(mediaIds: string[]): Promise<boolean> {
    return this.mediaRepo.commitMedias(mediaIds);
  }

  async getMediaByIds(ids: string[]): Promise<Media[]> {
    return this.mediaRepo.getMediaByIds(ids);
  }

  async getMediaStorageStats(ruleName?: string): Promise<MediaStorageStats> {
    return this.mediaRepo.getMediaStorageStats(ruleName);
  }

  async destroyManyByIds(ids: string[]): Promise<void> {
    await this.mediaRepo.destroyManyByIds(ids);
    return;
  }

  // Private methods
  private async validateRule({ ruleName, file }: IUploadMedia): Promise<void> {
    const { validations } = await this.ruleRepo.getRuleByName(ruleName);
    const { maxSize, allowedMimes } = validations as MediaValidationRule;
    if (file.size > maxSize)
      throw new BadRequestException(`File size more than ${maxSize} KB`);
    if (!allowedMimes.includes(file.mime as AllowedMimes))
      throw new BadRequestException(`File mime not accepted`);

    return;
  }

  private prepareStoreParams(
    file: MediaFileObject,
    rule: MediaRule,
    commit: boolean,
  ): Media {
    return {
      rule,
      ext: file.ext,
      size: file.size,
      originalName: file.name,
      mime: file.mime,
      commit,
      path: '',
      aliasName: file.randName,
    };
  }

  private async storeMedia(
    uploadData: IUploadMedia,
    isCommit: boolean,
  ): Promise<MediaResult> {
    const { file, ruleName } = uploadData;
    const rule = await this.ruleRepo.getRuleByName(ruleName);
    const { storage } = rule.options as MediaRuleOptions;
    let media: Media = this.prepareStoreParams(file, rule, isCommit);

    if (storage == MediaStorageOption.DRIVE) {
      const driveStore = new DriveStore(media, file);
      media = await driveStore.upload();
      media.url = driveStore.toMediaURL();
    }

    const { id } = await this.mediaRepo.create(media);

    return { id, mediaURL: media.url };
  }
}
