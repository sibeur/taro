import { MediaFileObject } from '@core/media/typesAndInterface/media';
import { Media } from '@core/media/entities/media';
import { MediaRuleOptions } from '@core/media/typesAndInterface/media_rule';
import { Store } from './store.interface';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import * as stream from 'stream';
import { join } from 'path';
const pipeline = promisify(stream.pipeline);

export class DriveStore implements Store {
  media: Media;
  file: MediaFileObject;
  constructor(media: Media, file: MediaFileObject) {
    this.media = media;
    this.file = file;
  }

  async upload(): Promise<Media> {
    const options: MediaRuleOptions = this.media.rule
      .options as MediaRuleOptions;
    const storagePath = options?.path ?? 'storage';
    this.media.path = `${storagePath}/${this.media.aliasName}`;
    await pipeline(
      this.file.binary,
      createWriteStream(join(process.cwd(), this.media.path)),
    );
    return this.media;
  }

  toMediaURL(): string {
    const baseURL = process.env.MEDIA_BASE_URL || 'http://localhost:3000';
    return `${baseURL}/media/${this.media.rule.name}/${this.media.aliasName}`;
  }
}
