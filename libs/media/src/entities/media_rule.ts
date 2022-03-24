import {
  MediaRuleOptions,
  MediaValidationRule,
} from '@core/media/typesAndInterface/media_rule';
import upload_option from '../configs/upload_option';

export class MediaRule {
  id?: string;
  name: string;
  validations: MediaValidationRule;
  options: MediaRuleOptions | any = upload_option;
}
