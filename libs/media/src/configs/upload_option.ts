import {
  MediaRuleOptions,
  MediaStorageOption,
} from '@core/media/typesAndInterface/media_rule';

export default {
  storage: process.env.MEDIA_STORAGE || MediaStorageOption.DRIVE,
  path: process.env.MEDIA_STORAGE || 'storage',
} as MediaRuleOptions;
