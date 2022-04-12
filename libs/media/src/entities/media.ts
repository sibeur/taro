import { MediaRule } from './media_rule';
export class Media {
  id?: string;
  originalName: string;
  aliasName: string;
  path: string;
  url?: string;
  size: number;
  mime: string;
  ext: string;
  commit?: boolean = false;
  rule?: MediaRule;
}

export class MediaStorageStats {
  commited: number;
  uncommited: number;
  total: number;
}
