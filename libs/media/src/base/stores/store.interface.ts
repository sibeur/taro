import { Media } from '@core/media/entities/media';
import { MediaFileObject } from '@core/media/typesAndInterface/media';

export interface Store {
  media: Media;
  file: MediaFileObject;
  upload(): Promise<Media>;
  toMediaURL(): string;
}
