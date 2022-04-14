import { Media } from '../entities/media';

export class MediaDeleteEvent {
  media: Media[];
  constructor(media: Media[]) {
    this.media = media;
  }
}
