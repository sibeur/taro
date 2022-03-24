import { ReadStream } from 'fs';
import { AllowedMimes } from './media_rule';

export type MediaFileObject = {
  binary: NodeJS.ReadableStream;
  randName: string;
  mime: string;
  ext: string;
  size: number;
  name: string;
};

export interface IUploadMedia {
  ruleName: string;
  file: MediaFileObject;
}

export type MediaFileStream = {
  file: ReadStream;
  fileMime: AllowedMimes;
  fileName: string;
  fileSize: number;
};

export type MediaResult = {
  id: string;
  mediaURL: string;
};
